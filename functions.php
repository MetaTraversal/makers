<?php
add_theme_support( 'post-thumbnails' );

require_once ("functions/functions-enqueue.php");
require_once ("functions/functions-custom.php");
require_once ("functions/functions-media.php");
require_once ("functions/functions-metabox.php");
require_once ("functions/functions-wpml-languages.php");

require_once ("functions/functions-publish.php");
require_once ("config.php");


require_once ("functions/functions-rest-menus.php");
require_once ("functions/functions-rest-filter-fields.php");
require_once ("functions/functions-rest-endpoints.php");
require_once ("functions/functions-rest-register.php");

?>