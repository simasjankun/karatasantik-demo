<?php
/**
 * Karatas Antik — Theme Functions
 *
 * @package karatasantik
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ─────────────────────────────────────────────
// Theme Setup
// ─────────────────────────────────────────────

function karatasantik_setup() {
	// Allow WordPress to manage the document title tag
	add_theme_support( 'title-tag' );

	// Enable featured images on posts and pages
	add_theme_support( 'post-thumbnails' );

	// Custom logo support
	add_theme_support( 'custom-logo', [
		'height'      => 100,
		'width'       => 400,
		'flex-width'  => true,
		'flex-height' => true,
	] );

	// Declare WooCommerce support
	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );

	// HTML5 markup support
	add_theme_support( 'html5', [
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
		'style',
		'script',
	] );

	// Register navigation menus
	register_nav_menus( [
		'primary' => __( 'Pagrindinis meniu', 'karatasantik' ),
	] );

	// Make theme text translatable
	load_theme_textdomain( 'karatasantik', get_template_directory() . '/languages' );
}
add_action( 'after_setup_theme', 'karatasantik_setup' );

// ─────────────────────────────────────────────
// Custom Image Sizes
// ─────────────────────────────────────────────

function karatasantik_image_sizes() {
	add_image_size( 'hero-banner',   1920, 800, true );
	add_image_size( 'product-card',   600, 600, true );
}
add_action( 'after_setup_theme', 'karatasantik_image_sizes' );

// ─────────────────────────────────────────────
// Enqueue Styles & Scripts
// ─────────────────────────────────────────────

function karatasantik_enqueue_assets() {
	// Main stylesheet
	wp_enqueue_style(
		'karatasantik-style',
		get_stylesheet_uri(),
		[],
		wp_get_theme()->get( 'Version' )
	);

	// Main JavaScript file (placeholder — add when ready)
	// wp_enqueue_script(
	// 	'karatasantik-main',
	// 	get_template_directory_uri() . '/assets/js/main.js',
	// 	[],
	// 	wp_get_theme()->get( 'Version' ),
	// 	true
	// );
}
add_action( 'wp_enqueue_scripts', 'karatasantik_enqueue_assets' );

// ─────────────────────────────────────────────
// Includes
// ─────────────────────────────────────────────

require get_template_directory() . '/inc/theme-options.php';
