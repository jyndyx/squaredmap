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
 * Inject GTM Scripts
 */
add_action('wp_head', function () { ?>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-FMQ8RV8D');</script>
  <!-- End Google Tag Manager -->
<?php }, 1);

function pm_insert_gtm_body_noscript() {
    if ( is_admin() ) return; // front-end only
    ?>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-FMQ8RV8D"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <?php
}
add_action('wp_body_open', 'pm_insert_gtm_body_noscript', 0);

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