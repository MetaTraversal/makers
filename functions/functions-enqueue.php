<?php

// enqueue_styles in wordpress theme
function enqueue_style()
{
    if (defined('WP_ENVIRONMENT_TYPE') && WP_ENVIRONMENT_TYPE === 'production') {
        wp_enqueue_style('makers', get_stylesheet_directory_uri() . '/style.min.css');

        wp_register_style(
            'bootstrap', // handle name 
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css', // the URL of the stylesheet 
            array(), // an array of dependent styles 
            '5.3.0', // version number 
            'all' // CSS media type 
        );
        wp_enqueue_style('bootstrap');

        wp_register_style(
            'font-awesome',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
            array(),
            '6.4.0',
            'all'
        );
        wp_enqueue_style('font-awesome');
    } else {

        wp_enqueue_style('makers', get_stylesheet_directory_uri() . '/style.css');

        wp_register_style(
            'bootstrap', // handle name 
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css', // the URL of the stylesheet 
            array(), // an array of dependent styles 
            '5.3.0', // version number 
            'all' // CSS media type 
        );
        wp_enqueue_style('bootstrap');

        wp_register_style(
            'font-awesome',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
            array(),
            '6.4.0',
            'all'
        );
        wp_enqueue_style('font-awesome');

    }
}
add_action('wp_enqueue_scripts', 'enqueue_style');

// enqueue_scripts in wordpress theme
function theme_scripts()
{


    $config_wp = array(
        "SITE_URL" => get_site_url(),
        "HOME_URL" => get_home_url(),
        "THEME_DIR_URL" => get_stylesheet_directory_uri(),
        "UPLOAD_DIR_URL" => wp_upload_dir(),
        "SITE_TITLE" => get_bloginfo('name'),
        "SITE_TAGLINE" => get_bloginfo('description'),
        "SITE_CUSTOM_LOGO" => wp_get_attachment_image_src(get_theme_mod('custom_logo'), 'full'),
        // "THEME_LOGO" => get_custom_logo()
        // "SITE_PLUGINS" => get_plugins(),
        // "SITE_ALL_OPTIONS" => wp_load_alloptions(),
        "SITE_ACTIVE_PLUGINS" => get_option('active_plugins'),
        "SITE_FRONT_PAGE" => get_option('page_on_front'),
        "SITE_POST_PAGE" => get_option('page_for_posts'),
    );


    wp_register_script('config-script', get_template_directory_uri() . '/src/js/app/config/AppConfig.js', array('jquery'), '1.0.0', true);
    wp_enqueue_script('config-script');
    wp_localize_script('config-script', 'configData', $config_wp);

    if (defined('WP_ENVIRONMENT_TYPE') && WP_ENVIRONMENT_TYPE === 'production') {
        wp_register_script('app', get_stylesheet_directory_uri() . '/app.min.js', array('jquery'), '1.0.0', true);
        wp_enqueue_script('app');

        wp_register_script('vendor', get_stylesheet_directory_uri() . '/vendor.min.js', array('jquery'), '1.0.0', true);
        wp_enqueue_script('vendor');

    } else {
        wp_register_script('app', get_stylesheet_directory_uri() . '/app.js', array('jquery'), rand(100000, 999999), true);
        wp_enqueue_script('app');

        wp_register_script('vendor', get_stylesheet_directory_uri() . '/vendor.js', array('jquery'), rand(100000, 999999), true);
        wp_enqueue_script('vendor');

    }


    wp_register_script('bootstrap', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js', array('jquery'), '5.3.0', true);
    wp_enqueue_script('bootstrap');

    // A-Frame CDN's
    wp_register_script('aframe', 'https://aframe.io/releases/1.4.2/aframe.min.js', array('jquery'), '1.4.2', false);
    wp_enqueue_script('aframe');

    wp_register_script('aframe-environment', 'https://unpkg.com/aframe-environment-component@1.3.3/dist/aframe-environment-component.min.js', array('aframe'), '1.3.3', true);
    wp_enqueue_script('aframe-environment');

    //uncomment to add aframe-extras full support
    wp_register_script('aframe-extras', 'https://cdn.jsdelivr.net/gh/c-frame/aframe-extras@7.1.0/dist/aframe-extras.min.js', array('aframe'), '7.1.0', true);
    wp_enqueue_script('aframe-extras');
    // uncomment to add aframe-extras-control partial support
    // wp_register_script('aframe-extras-controls', 'https://cdn.jsdelivr.net/gh/c-frame/aframe-extras@7.1.0/dist/aframe-extras.controls.min.js', array('aframe'),'7.1.0', true);
    // wp_enqueue_script('aframe-extras-controls');

    wp_register_script('aframe-superhands', 'https://unpkg.com/super-hands@^3.0.3/dist/super-hands.min.js', array('aframe'), '3.0.3', true);
    wp_enqueue_script('aframe-superhands');

    // wp_register_script('aframe-teleport','https://unpkg.com/aframe-teleport-controls@0.3.x/dist/aframe-teleport-controls.min.js', array('aframe'),'0.3.x', true);
    // wp_enqueue_script('aframe-teleport');

    wp_register_script('aframe-teleport', 'https://rawgit.com/fernandojsg/aframe-teleport-controls/master/dist/aframe-teleport-controls.min.js', array('aframe'), '', true);
    wp_enqueue_script('aframe-teleport');

    wp_register_script('aframe-troika-text', 'https://unpkg.com/aframe-troika-text/dist/aframe-troika-text.min.js', array('aframe'), '0.11.0', true);
    wp_enqueue_script('aframe-troika-text');

    // wp_register_script('aframe-input-mapping-component', 'https://unpkg.com/aframe-input-mapping-component/dist/aframe-input-mapping-component.min.js', array('aframe'),'', true);
    // wp_enqueue_script('aframe-input-mapping-component');

    wp_register_script('aframe-physics-system', 'https://cdn.jsdelivr.net/gh/c-frame/aframe-physics-system@v4.2.2/dist/aframe-physics-system.min.js', array('aframe'), '4.2.2', true);
    wp_enqueue_script('aframe-physics-system');

}
add_action('wp_enqueue_scripts', 'theme_scripts');



?>