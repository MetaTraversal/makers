<?php


/*WP REST API CUSTOM ENDPOINTS. RETURNS SPECIFIC THUMBNAIL URL*/ 


/*
	CUSTOM MENU ROUTING
*/

function get_menu() {
    # Change 'menu' to your own navigation slug.
    return wp_get_nav_menu_items('menu');
}

add_action( 'rest_api_init', function () {
		register_rest_route( 'myroutes', '/menu', array(
		'methods' => 'GET',
		'callback' => 'get_menu',
		 'permission_callback' => '__return_true',
		'schema' => null
		) 


	);
} );


/* 
	media
*/

add_action( 'rest_api_init', 'register_post_media' );
 function register_post_media() {
 

	register_rest_field( ['post','page','profile','resource','hardware'], 'post_media', array(
		'get_callback' => 'get_post_media'

		)
	);
}

function get_post_media( $object ) { 

	$postmeta_media_fields = "hero,_thumbnail_id,featured_video,screen_image,screenshot,logo";

	
	foreach(explode(",",$postmeta_media_fields) as $key  => $field){
		$media_id = get_post_meta($object['id'],$field,false);// returns Array, not string!!
		$post_media_data = array();
		foreach($media_id as $key => $value){
			array_push($post_media_data,get_media_data_by_id($value));
			
		}

		$post_media_urls[$field] = $post_media_data;
	
	}

	return $post_media_urls;


}


/* 
	media
*/

add_action( 'rest_api_init', 'register_related_posts' );
 function register_related_posts() {
 

	register_rest_field( ['post','page','profile','resource','hardware'], 'related', array(
		'get_callback' => 'get_related_posts'

		)
	);
}

function get_related_posts( $object ) { 
	$related_profiles = get_post_meta($object['id'],'related-profile');
	$related_resources = get_post_meta($object['id'],'related-resource');
	
/*
	$postmeta_media_fields = "hero,_thumbnail_id,featured_video,screen_image,screenshot,logo";

	
	foreach(explode(",",$postmeta_media_fields) as $key  => $field){
		$media_id = get_post_meta($object['id'],$field,false);// returns Array, not string!!
		$post_media_data = array();
		foreach($media_id as $key => $value){
			array_push($post_media_data,get_media_data_by_id($value));
			
		}

		$post_media_urls[$field] = $post_media_data;
	
	}
*/
	return array_merge($related_resources,
				$related_profiles);


}







add_action( 'rest_api_init', 'register_media_data' );
 function register_media_data() {
 

	register_rest_field( 'attachment', 'data', array(//THE ROUTE IS MEDIA/the type is attachment
		'get_callback' => 'get_media_data'

		)
	);
}

function get_translation_data($id){
	
$translation_array = [];
$type = apply_filters( 'wpml_element_type', get_post_type( $id ) );
$trid = apply_filters( 'wpml_element_trid', false, $id, $type );
  
$translations = apply_filters( 'wpml_get_element_translations', array(), $trid, $type );
$translations = apply_filters( 'wpml_get_element_translations', array(), $trid, $type );
	/*
	translation_id: "3526",
language_code: "zh-hans",
element_id: "3525",
source_language_code: "en",
element_type: "post_attachment",
original: "0",
post_title: "48 Hours in the Metaverse",
post_status: "inherit"*/
foreach ( $translations as $lang => $translation ) {
	if($lang=='en'){
		$caption = wp_get_attachment_caption($translation->element_id);
	} else {
		$caption = get_post($translation->element_id)->post_excerpt;
	}
	
	$translation_array[$lang] =  [
								  'translation_id'=>$translation->translation_id,
								  
							'alt' => get_post_meta($translation->element_id,"_wp_attachment_image_alt",true),
		'caption' => $caption,
		'title'=> get_the_title($translation->element_id),
		'slug'=> get_post($translation->element_id)->post_name,
		'desc' =>get_post($translation->element_id)->post_content,
								 
								 
								 
								 
								 ];	
    
}
	
	
	return $translation_array;
	
	
	
	
}

function get_media_data_by_id($id){//this function builds the data for a lean json packet of media
		$data = array();  
	$id = $id;
	$url = wp_upload_dir();
	$upload_path = $url['baseurl']."/";
	$file_path = str_replace($upload_path,'',wp_get_attachment_url($id));
	$file = basename($file_path);
	$path = str_replace($file,"",$file_path);
	$mime = get_post_mime_type( $id );
	$meta  = (array) wp_get_attachment_metadata( $id,true);
	$full_path = wp_upload_dir();


	$meta_data = array();
	/*
	
		The meta data properties are only accessible inside a loop for some dumb reason.
	*/
	if(strpos($mime,'image/') && !strpos($mime,'svg')){ // the i is left of so the strpos returns a postive value
		$meta_data = array();
		foreach($meta as $key => $value){
			if($key == 'width'){
				$meta_data['w'] = $value;
			} else if($key == 'height'){
				$meta_data['h'] = $value;
			} else if($key == 'sizes'){
				$meta_data['sizes'] = array();

				if(get_post_mime_type( $id ) != 'image/svg+xml'){// no need to size
					foreach($meta[$key] as $size_name => $props){
						$meta_data['sizes'][$size_name] = $meta[$key][$size_name]['file'];
					}
				}
			}

			//
		}
	} else {
		//let non image mimetypes pass their full metadata
		$meta_data = $meta;
	}
	
	$data = array(
		'id' => $id,
		'alt' => get_post_meta($id,"_wp_attachment_image_alt",true),
		'caption' => wp_get_attachment_caption($id),
		'title'=> get_the_title($id),
		'slug'=> get_post($id)->post_name,
		'desc' =>get_post($id)->post_content,
		'path'=> $path,
		'file' => $file,
		'mime' => $mime,
		'meta' => $meta_data,
		'full_path' => "/wp-content/uploads/".$path.$file,
		'default_lang'=>@$default_lang,
		'trans'=>get_translation_data($id)
		
	);

 return $data;//from functions.php,

}

function get_media_data( $object ) { 
   
	return get_media_data_by_id($object['id']); // because this is a callback which passes in the full object and we want to be able to get the data elsewhere with just the id. 
}


 
/* 
Social_url
*/
add_action( 'rest_api_init', 'register_social_url' );
function register_social_url() {
 

	register_rest_field( ['social'], 'social_url', array(
		'get_callback' => 'get_social_url',
		'schema' => null,
		)
	);
}
 
function get_social_url( $object ) {
	
 return get_post_meta($object['id'],"social_url",true);//from functions.php,
}

/* 
Social_url
*/
add_action( 'rest_api_init', 'register_hardware_profiles' );
function register_hardware_profiles() {
 

	register_rest_field( ['hardware'], 'profiles', array(
		'get_callback' => 'get_hardware_profiles',
		'schema' => null,
		)
	);
}
 
function get_hardware_profiles( $object ) {
	
global $wpdb;
	$q = $wpdb->get_results("select post_id from wp_postmeta where meta_value = $object[id] order by post_id");
	$posts = array();
	foreach($q as $key=>$value){
		array_push($posts,$value->post_id);
	}


 return $posts;//from functions.php,
}



/* 
	IMAGES
*/
add_action( 'rest_api_init', 'register_thumbnail_url' );
function register_thumbnail_url() {
 

	register_rest_field( ['profile','page','post'], 'thumbnail_url', array(
		'get_callback' => 'get_thumbnail_url',
		'schema' => null,
		)
	);
}
 
function get_thumbnail_url( $object ) {
	
 return getThumbnailVersions($object['featured_media']);//from functions.php,
}


/* 
	IMAGE VERSIONS
*/

add_action( 'rest_api_init', 'register_thumbnail_url_versions' );
 function register_thumbnail_url_versions() {
 

	register_rest_field( array('profile','page','post'), 'thumbnail_versions', array(
		'get_callback' => 'get_thumbnail_versions',
		'schema' => null,
		)
	);
}
 
function get_thumbnail_versions( $object ) {

 return getThumbnailVersions( $object['id'] );//from functions.php,
}

/*
	Screen Images

*/
add_action( 'rest_api_init', 'register_screen_images' );
 function register_screen_images() {
 

	register_rest_field( array('profile','page','post'), 'screen_images', array(
		'get_callback' => 'get_screen_images'

		)
	);
}
 
function get_screen_images( $object ) {

 return get_post_meta($object['id'],"screen_image") ;//from functions.php,
}




/* 
	3D Properties
*/

add_action( 'rest_api_init', 'register_properties_3D' );
 function register_properties_3D() {
 

	register_rest_field( array('profile','post','page','event','profile','resource'), 'properties_3D', array(
		'get_callback' => 'get_properties_3D',
		'schema' => null,
		)
	);
}

function get_attachment_path($id){

	$url = wp_upload_dir();
	$path = $url['path']."/";
    $uploads_path =  $url['baseurl']."/";
	$attachment_path = str_replace($path,"",wp_get_attachment_url($id));
	$attachment_path= str_replace("-scaled","",$attachment_path);
	return $attachment_path;


}


function add_3D_media_property($properties_3D,$post_id,$property){
	$id = get_post_meta($post_id,$property,true);
	$src = get_attachment_path($id);
	$props = get_post_meta($post_id,"properties",true);
	
	if($id !=''){	
		$properties_3D[$property] = ['id'=>$id,'src'=>$src,'props'=>$props];
	}


	return $properties_3D;

}



function get_properties_3D( $object ) {
	$post_id = $object['id'];
	$use_aframe = get_post_meta($post_id,"use_aframe",true);
	$url = wp_upload_dir();
	$path = $url['baseurl']."/";
	
	$properties_3D = [];
	if(@$use_aframe){
		$properties_3D['use_aframe'] = @$use_aframe;
	}
	// this gets the metadata for these models

	$properties_3D= add_3D_media_property($properties_3D,$post_id,"skybox");
	$properties_3D= add_3D_media_property($properties_3D,$post_id,"logo_3d");
	$properties_3D= add_3D_media_property($properties_3D,$post_id,"logo_wide_3D");
	$properties_3D= add_3D_media_property($properties_3D,$post_id,"button_3D");
	$properties_3D= add_3D_media_property($properties_3D,$post_id,"world_model");
	$properties_3D= add_3D_media_property($properties_3D,$post_id,"nav_mesh");

	$furniture = get_post_meta($post_id,"furniture");
	
	$furniture_array = array();
	if(is_array($furniture)){
	
		foreach($furniture as $key => $value){

			$meta_data = get_media_data_by_id($value);



			array_push($furniture_array,$meta_data);
			
		}
	
	}
	$properties_3D['furniture'] = $furniture_array;


	
	return @$properties_3D;//from functions.php,
}




/* 
	FEATURED VIDEO
*/

add_action( 'rest_api_init', 'register_featured_video' );
 function register_featured_video() {
 

	register_rest_field( array('profile','post','page'), 'featured_video', array(
		'get_callback' => 'get_featured_video',
		'schema' => null,
		)
	);
}
 
function get_featured_video( $object ) {
	$post_id = $object['id'];
	$video_id = get_post_meta($post_id,"featured_video",true);
	$url = wp_upload_dir();
	$path = $url['baseurl']."/";
		
		 
		$video = array(
			"video_id"=>$video_id,
			"video_url"=>get_post_meta($post_id,"featured_video_url",true),
			"video_aspect"=>get_post_meta($post_id,"video_aspect",true),
		);


	return @$video;//from functions.php,
}

/*
	REGISTER POST CATEGORIES		
*/

add_action( 'rest_api_init', 'register_post_cats' );

function register_post_cats() {

		register_rest_field( array('profile','post','page','resource'), 'cats', array(
			'get_callback' => 'get_post_cats',
			'schema' => null,
		)
	);
}
function get_post_cats($object){
	$post_id = $object['id'];
	return wp_get_post_categories( $post_id,array( 'fields' => 'ids' ));
}

/*
	REGISTER POST TAGS		
*/
add_action( 'rest_api_init', 'register_post_tags' );

function register_post_tags() {

		register_rest_field( array('profile','post','page'), 'tags', array(
			'get_callback' => 'get_post_tags',
			'schema' => null,
		)
	);
}
function get_post_tags($object){
	$post_id = $object['id'];
	return wp_get_post_tags( $post_id,array( 'fields' => 'ids' ));
}

/*
//this is being retired in favor of a meta field
add_action( 'rest_api_init', 'register_profile_info' );
		
	function register_profile_info() {
		
		register_rest_field( array('profile','resource'), 'info', array(
			'get_callback' => 'get_profile_info',
			'schema' => null,
			)
		);
	}
		
    function get_profile_info( $object ) {
        $post_id = $object['id'];
        $fields = "url,company,solution_name, unique_value_proposition,tagline,use_cases,max_spectators,max_collaborators,demo_video,video_embed_code,url, description,email,talk_title,talk_description,facebook,mdn,flickr,github,google_plus,instagram,linkedin,location,medium,pinterest,rss,skype,slack,telegram,Tumblr,profile_title,timezone,blurb,resources,twitter,vimeo,website,wikipedia,youtube,acronym,name,apply_url,blog_url,conference_url,contact_url,events_url,jobs_url,logo_svgtag,logo_url";

        $profile_info = array();

        foreach(explode(",",$fields) as $key =>$value){
            if(@get_post_meta($post_id,$value,true)  != ''){
                $profile_info[$value] = get_post_meta($post_id,$value,true);
            }
        }

        return $profile_info;
	}
	

*/

	add_action( 'rest_api_init', 'register_profile_meta' );
		
	function register_profile_meta() {
		
		register_rest_field( array('profile','resource','event'), 'meta', array(
			'get_callback' => 'get_profile_meta',
			'schema' => null,
			)
		);
	}
		
    function get_profile_meta( $object ) {
		//shift down postmeta from [0];
		$new_meta;
		$meta = get_post_meta( $object['id']);
		foreach($meta as $key => $value){
			$new_meta[$key] = $value[0];
		}


        return @$new_meta;
	}



/*
	Screen Images

*/
add_action( 'rest_api_init', 'register_screenshots' );
 function register_screenshots() {
 

	register_rest_field( array('profile'), 'screenshots', array(
		'get_callback' => 'get_screenshots'

		)
	);
}
 
function get_screenshots( $object ) {

 return get_post_meta($object['id'],"screenshot") ;//from functions.php,
}










add_action( 'rest_api_init', 'register_support_hardware' );
		
	function register_support_hardware() {
		
		register_rest_field( 'profile', 'support_hardware', array(
			'get_callback' => 'get_profile_hardware',
			'schema' => null,
			)
		);
	}
		
    function get_profile_hardware( $object ) {
        $post_id = $object['id'];
        $fields = "hardware";

        $profile_info = array();

        foreach(explode(",",$fields) as $key =>$value){
            if(@get_post_meta($post_id,$value,true)  != ''){
               
            }
        }

        return  $profile_info[$value] = get_post_meta($post_id,$value);
    }






	add_action( 'rest_api_init', 'register_seo_info' );
		
	function register_seo_info() {
		
		register_rest_field( 'seo', 'seo', array(
			'get_callback' => 'get_seo_info',
			'schema' => null,
			)
		);
	}
		
    function get_seo_info( $object ) {
        $post_id = $object['id'];
       

        $seo = array(
			
			"keyword"=>get_post_meta($post_id,"_yoast_wpseo_focuskw", true),
            "tw-desc" =>get_post_meta($post_id,"_yoast_wpseo_twitter-description", true),
                "tw-title" =>get_post_meta($post_id,"_yoast_wpseo_twitter-title", true),
                "og-desc" =>get_post_meta($post_id,"_yoast_wpseo_opengraph-description", true),
                "og-title" =>get_post_meta($post_id,"_yoast_wpseo_opengraph-title",  true),
                "tw-image" =>get_post_meta($post_id,"_yoast_wpseo_twitter-image",  true),
                "og-image" =>get_post_meta($post_id,"_yoast_wpseo_opengraph-image",  true),

			);

      

        return $seo;
    }






	add_action( 'rest_api_init', 'register_event_info' );
		
	function register_event_info() {
		
		register_rest_field( 'event', 'event_info', array(
			'get_callback' => 'get_event_info',
			'schema' => null,
			)
		);
	}
		
		function get_event_info( $object ) {
		$post_id = $object['id'];
			$event_info = array(
				"duration"=>get_post_meta($post_id,"duration",true),
				"utc_start"=>get_post_meta($post_id,"utc_start",true),
				
				
			);



		return $event_info;
		}














   





/*WP REST API CUSTOM ENDPOINT. RETURNS SPECIFIC OBJECT OF profile INFO*/ 

	add_action( 'rest_api_init', 'register_project_info' );
		
	function register_project_info() {
		
		register_rest_field( 'project', 'project_info', array(
			'get_callback' => 'get_project_info',
			'schema' => null,
			)
		);
	}
		
		function get_project_info( $object ) {
		$post_id = $object['id'];
			$project_info = array(
				"title"=>get_post_meta($post_id,"project_title",true),
				"url"=>get_post_meta($post_id,"project_url",true),
				"client"=>get_post_meta($post_id,"project_client",true),
				"agency"=>get_post_meta($post_id,"project_agency",true),
				"era"=>get_post_meta($post_id,"project_era",true)
			);



		return $project_info;
		}
/*
		/project info endpoint
*/
//without this the widgets and menus options in wp-admin disappear.
if ( function_exists('register_sidebars') ){
    register_sidebar( array(
        'name' => __( 'Footer', 'makers' ),
        'id' => 'footer',
        'description' => __( '', 'makers' ),
        'before_widget' => '',
	'after_widget'  => '',
	'before_title'  => '',
	'after_title'   => '',
    ) );
}


// update_VR_inspector

add_action('rest_api_init', 'register_inspecter_changes');
function register_inspecter_changes() {
	register_rest_route('myroutes', '/update_inspecter',array(
		'methods' => 'POST',
		'callback' => 'update_inspecter_data',
		'permission_callback' => '__return_true',
	)
	);
}

function update_inspecter_data($request) {
	$file_name = $_POST['page'];
	$file = $request->get_file_params();
    $upload_dir = wp_upload_dir();;
	$file_type = $file["file"]["type"]; 
	$file_tmp_name = $file["file"]['tmp_name'];
    $file_path = get_stylesheet_directory() . '/data/' . $file_name;

    if (move_uploaded_file($file_tmp_name, $file_path)) {
	return array(
            'success' => true,
			'message' => 'Data Updated Successfully.',
            // 'file_path' => $file_path,
        );
    } else {
        return array(
            'success' => false,
            'message' => 'Data Update Failed.',
        );
    }}


// getting wordpress data and pass in publish method
add_action('rest_api_init', 'register_data_publish');
function register_data_publish() {
	register_rest_route('myroutes', '/data_publish',array(
		'methods' => 'POST',
		'callback' => 'publish_data',
		'permission_callback' => '__return_true',
	)
	);
}

function publish_data($request) {
	$slug = $_POST['slug'];
	$jsonData = $_POST['data'];
	$decodedString = stripslashes($jsonData);
    $data =json_decode($decodedString);

	if (!empty($slug) && !empty($data) ){
		publishThis($slug,$data);
		return array(
            'success' => true,
			'message' => 'Data Found Successfully...',
        );
	} else {
		return array(
            'success' => false,
			'message' => 'Something went wrong ! Data not found...',
        );
	}
}

?>