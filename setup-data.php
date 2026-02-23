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
// 3. Navigation Menu
// ─────────────────────────────────────────────

WP_CLI::line( '── Navigation Menu ────────────────────' );
WP_CLI::line( '' );

$menu_name     = 'Pagrindinis meniu';
$menu_location = 'primary';

$existing_menu = wp_get_nav_menu_object( $menu_name );

if ( $existing_menu ) {

	WP_CLI::line( "  [skip]    Menu \"{$menu_name}\" already exists (ID: {$existing_menu->term_id})" );

} else {

	$menu_id = wp_create_nav_menu( $menu_name );

	if ( is_wp_error( $menu_id ) ) {

		WP_CLI::warning( "  [error]   Could not create menu \"{$menu_name}\" — " . $menu_id->get_error_message() );

	} else {

		WP_CLI::success( "  [created] Menu \"{$menu_name}\" (ID: {$menu_id})" );
		WP_CLI::line( '' );

		// ── Helper: add a taxonomy (product_cat) menu item ────────────

		$add_term_item = function( $term_name, $parent_item_id = 0 ) use ( $menu_id ) {
			$term = get_term_by( 'name', $term_name, 'product_cat' );

			if ( ! $term ) {
				WP_CLI::warning( "    [error]   Term not found: \"{$term_name}\"" );
				return 0;
			}

			$item_id = wp_update_nav_menu_item( $menu_id, 0, [
				'menu-item-title'     => $term->name,
				'menu-item-object'    => 'product_cat',
				'menu-item-object-id' => $term->term_id,
				'menu-item-type'      => 'taxonomy',
				'menu-item-parent-id' => $parent_item_id,
				'menu-item-status'    => 'publish',
			] );

			if ( is_wp_error( $item_id ) ) {
				WP_CLI::warning( "    [error]   \"{$term_name}\" — " . $item_id->get_error_message() );
				return 0;
			}

			$indent = $parent_item_id ? '    ' : '  ';
			WP_CLI::success( "{$indent}[menu item] {$term->name} (item ID: {$item_id})" );
			return $item_id;
		};

		// ── Helper: add a page menu item ──────────────────────────────

		$add_page_item = function( $page_title ) use ( $menu_id ) {
			$results = get_posts( [
				'post_type'      => 'page',
				'title'          => $page_title,
				'post_status'    => 'publish',
				'posts_per_page' => 1,
			] );

			if ( empty( $results ) ) {
				WP_CLI::warning( "  [error]   Page not found: \"{$page_title}\"" );
				return 0;
			}

			$page    = $results[0];
			$item_id = wp_update_nav_menu_item( $menu_id, 0, [
				'menu-item-title'     => $page->post_title,
				'menu-item-object'    => 'page',
				'menu-item-object-id' => $page->ID,
				'menu-item-type'      => 'post_type',
				'menu-item-parent-id' => 0,
				'menu-item-status'    => 'publish',
			] );

			if ( is_wp_error( $item_id ) ) {
				WP_CLI::warning( "  [error]   \"{$page_title}\" — " . $item_id->get_error_message() );
				return 0;
			}

			WP_CLI::success( "  [menu item] \"{$page->post_title}\" (item ID: {$item_id})" );
			return $item_id;
		};

		// ── Juvelyrika ────────────────────────────────────────────────

		$juvelyrika_id = $add_term_item( 'Juvelyrika' );
		if ( $juvelyrika_id ) {
			$add_term_item( 'Auksiniai žiedai',          $juvelyrika_id );
			$add_term_item( 'Sužadėtuvių žiedai',        $juvelyrika_id );
			$add_term_item( 'Auksiniai auskarai',         $juvelyrika_id );
			$add_term_item( 'Auksinės sagės',             $juvelyrika_id );
			$add_term_item( 'Grandinėlės ir pakabukai',  $juvelyrika_id );
			$add_term_item( 'Sidabriniai dirbiniai',      $juvelyrika_id );
		}

		WP_CLI::line( '' );

		// ── Antikvariatas ─────────────────────────────────────────────

		$antikvariatas_id = $add_term_item( 'Antikvariatas' );
		if ( $antikvariatas_id ) {
			$add_term_item( 'Antikvariniai laikrodžiai',             $antikvariatas_id );
			$add_term_item( 'Sidabriniai indai ir stalo įrankiai',   $antikvariatas_id );
			$add_term_item( 'Veidrodžiai ir rėmai',                  $antikvariatas_id );
		}

		WP_CLI::line( '' );

		// ── Pages ─────────────────────────────────────────────────────

		$add_page_item( 'Akcijos ir nuolaidos' );
		$add_page_item( 'Dovanų kuponai' );
		$add_page_item( 'Apie mus' );
		$add_page_item( 'Kontaktai' );

		WP_CLI::line( '' );

		// ── Assign to theme location ──────────────────────────────────

		$locations                = get_theme_mod( 'nav_menu_locations', [] );
		$locations[ $menu_location ] = $menu_id;
		set_theme_mod( 'nav_menu_locations', $locations );
		WP_CLI::success( "  [assigned] Menu assigned to location \"{$menu_location}\"" );
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
