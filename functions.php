<?php
/**
 * Enqueue Child Theme Styles and Inits
 */
function perlemedia_enqueue_styles() {
    wp_enqueue_style( 'kadence-style', get_template_directory_uri() . '/style.css' );
    wp_enqueue_style( 'perlemedia-style', get_stylesheet_directory_uri() . '/style.css', array('kadence-style') );
    wp_enqueue_script( 'perlemedia-js', get_stylesheet_directory_uri() . '/assets/js/perlemedia.js', array('jquery'), filemtime( get_stylesheet_directory() . '/assets/js/perlemedia.js' ), true );

    // GSAP
    wp_enqueue_script( 'gsap', 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js', array(), '3.12.5', true );
    wp_enqueue_script( 'gsap-scrolltrigger', 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js', array('gsap'), '3.12.5', true );
    wp_enqueue_script( 'perlemedia-gsap', get_stylesheet_directory_uri() . '/assets/js/gsap.js', array('jquery', 'gsap', 'gsap-scrolltrigger'), filemtime( get_stylesheet_directory() . '/assets/js/gsap.js' ), true);

    // Defer scripts
    if ( function_exists('wp_script_add_data') ) {wp_script_add_data( 'perlemedia-gsap', 'strategy', 'defer' );}
}
add_action( 'wp_enqueue_scripts', 'perlemedia_enqueue_styles' );

/**
 * Inject Google Analytics Script
 */
add_action('wp_head', function () { ?>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-CXKJT0LQ3D"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-CXKJT0LQ3D');
  </script>
<?php }, 1);

/**
 * Custom login page logo
 */
function customLoginLogo()
{
echo '<style type="text/css"> h1 a {  background-image:url("https://perlemedia.com/wp-content/uploads/2019/01/perlemedia-logo.png") !important; height:73px!important;
		width:300px!important;
		background-size: 300px 73px!important;
		background-repeat: no-repeat!important; } 
    body.login { background: #21242e !important; }
    #loginform { background: #c9c9c9 !important; }
    </style>';
}
add_action('login_head',  'customLoginLogo');
function customLoginLogoURL() {
    return 'https://perlemedia.com';
}
add_filter( 'login_headerurl', 'customLoginLogoURL' );
function customLoginLogoTitle() {
    return 'PerleMedia Website Design & Development';
}
add_filter( 'login_headertitle', 'customLoginLogoTitle' );