<?php
/**
 * Karatas Antik — Demo Data Setup
 *
 * One-time WP-CLI script that creates all initial demo data.
 * Run via: wp eval-file setup-data.php
 *
 * @package karatasantik
 */

// ─────────────────────────────────────────────
// Guards
// ─────────────────────────────────────────────

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	die( 'This script must be run via WP-CLI: wp eval-file setup-data.php' . PHP_EOL );
}

if ( ! class_exists( 'WooCommerce' ) ) {
	WP_CLI::error( 'WooCommerce is not active. Please activate WooCommerce and try again.' );
}

// ─────────────────────────────────────────────
// Data Definitions
// ─────────────────────────────────────────────

$product_categories = [
	'Juvelyrika'   => [
		'Auksiniai žiedai',
		'Sužadėtuvių žiedai',
		'Auksiniai auskarai',
		'Auksinės sagės',
		'Grandinėlės ir pakabukai',
		'Sidabriniai dirbiniai',
	],
	'Antikvariatas' => [
		'Antikvariniai laikrodžiai',
		'Sidabriniai indai ir stalo įrankiai',
		'Veidrodžiai ir rėmai',
	],
];

$pages = [
	'Apie mus',
	'Kontaktai',
	'Dovanų kuponai',
	'Akcijos ir nuolaidos',
];

// ─────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────

WP_CLI::line( '' );
WP_CLI::line( '╔══════════════════════════════════════╗' );
WP_CLI::line( '║   Karatas Antik — Demo Data Setup    ║' );
WP_CLI::line( '╚══════════════════════════════════════╝' );
WP_CLI::line( '' );

// ─────────────────────────────────────────────
// 1. Product Categories
// ─────────────────────────────────────────────

WP_CLI::line( '── Product Categories ─────────────────' );
WP_CLI::line( '' );

$taxonomy = 'product_cat';

foreach ( $product_categories as $parent_name => $children ) {

	// Create or retrieve the parent category
	$parent_exists = term_exists( $parent_name, $taxonomy );

	if ( $parent_exists ) {
		$parent_id = (int) $parent_exists['term_id'];
		WP_CLI::line( "  [skip]    {$parent_name} (already exists, ID: {$parent_id})" );
	} else {
		$result = wp_insert_term( $parent_name, $taxonomy );

		if ( is_wp_error( $result ) ) {
			WP_CLI::warning( "  [error]   {$parent_name} — " . $result->get_error_message() );
			WP_CLI::line( '' );
			continue;
		}

		$parent_id = (int) $result['term_id'];
		WP_CLI::success( "  [created] {$parent_name} (ID: {$parent_id})" );
	}

	// Create child categories under this parent
	foreach ( $children as $child_name ) {
		$child_exists = term_exists( $child_name, $taxonomy, $parent_id );

		if ( $child_exists ) {
			$child_id = (int) $child_exists['term_id'];
			WP_CLI::line( "    [skip]    {$child_name} (already exists, ID: {$child_id})" );
		} else {
			$result = wp_insert_term( $child_name, $taxonomy, [ 'parent' => $parent_id ] );

			if ( is_wp_error( $result ) ) {
				WP_CLI::warning( "    [error]   {$child_name} — " . $result->get_error_message() );
			} else {
				$child_id = (int) $result['term_id'];
				WP_CLI::success( "    [created] {$child_name} (ID: {$child_id})" );
			}
		}
	}

	WP_CLI::line( '' );
}

// ─────────────────────────────────────────────
// 2. Pages
// ─────────────────────────────────────────────

WP_CLI::line( '── Pages ──────────────────────────────' );
WP_CLI::line( '' );

foreach ( $pages as $page_title ) {

	// Check for an existing page with this exact title (any status)
	$existing = get_posts( [
		'post_type'      => 'page',
		'title'          => $page_title,
		'post_status'    => 'any',
		'posts_per_page' => 1,
		'fields'         => 'ids',
	] );

	if ( ! empty( $existing ) ) {
		WP_CLI::line( "  [skip]    \"{$page_title}\" (already exists, ID: {$existing[0]})" );
		continue;
	}

	$page_id = wp_insert_post(
		[
			'post_title'   => $page_title,
			'post_name'    => sanitize_title( $page_title ),
			'post_status'  => 'publish',
			'post_type'    => 'page',
			'post_author'  => 1,
			'post_content' => '',
		],
		true // Return WP_Error on failure
	);

	if ( is_wp_error( $page_id ) ) {
		WP_CLI::warning( "  [error]   \"{$page_title}\" — " . $page_id->get_error_message() );
	} else {
		WP_CLI::success( "  [created] \"{$page_title}\" (ID: {$page_id})" );
	}
}

// ─────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────

WP_CLI::line( '' );
WP_CLI::line( '╔══════════════════════════════════════╗' );
WP_CLI::line( '║   Setup complete.                    ║' );
WP_CLI::line( '╚══════════════════════════════════════╝' );
WP_CLI::line( '' );
