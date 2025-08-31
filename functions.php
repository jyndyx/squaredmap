<?php
// Enqueue parent + child theme styles
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

// Output Google Analytics (gtag) as early in <head> as possible.
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