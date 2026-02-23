<?php
/**
 * Karatas Antik — Theme Options (WordPress Customizer)
 *
 * @package karatasantik
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ─────────────────────────────────────────────
// Sanitize Helpers
// ─────────────────────────────────────────────

/**
 * Sanitize a checkbox value — returns 1 or 0.
 */
function karatasantik_sanitize_checkbox( $value ) {
	return ( '1' === $value || true === $value ) ? 1 : 0;
}

// ─────────────────────────────────────────────
// Customizer Registration
// ─────────────────────────────────────────────

function karatasantik_customize_register( WP_Customize_Manager $wp_customize ) {

	// ── Panel ─────────────────────────────────────────────────────

	$wp_customize->add_panel( 'karatasantik_panel', [
		'title'    => __( 'Karatas Antik Settings', 'karatasantik' ),
		'priority' => 130,
	] );

	// ═════════════════════════════════════════════
	// Section: Contact Info
	// ═════════════════════════════════════════════

	$wp_customize->add_section( 'karatasantik_contact', [
		'title'    => __( 'Contact Info', 'karatasantik' ),
		'panel'    => 'karatasantik_panel',
		'priority' => 10,
	] );

	// Phone
	$wp_customize->add_setting( 'karatasantik_phone', [
		'default'           => '+370 000 0000',
		'transport'         => 'refresh',
		'sanitize_callback' => 'sanitize_text_field',
	] );
	$wp_customize->add_control( 'karatasantik_phone', [
		'label'   => __( 'Phone Number', 'karatasantik' ),
		'section' => 'karatasantik_contact',
		'type'    => 'text',
	] );

	// Email
	$wp_customize->add_setting( 'karatasantik_email', [
		'default'           => 'info@karatasantik.lt',
		'transport'         => 'refresh',
		'sanitize_callback' => 'sanitize_email',
	] );
	$wp_customize->add_control( 'karatasantik_email', [
		'label'   => __( 'Email Address', 'karatasantik' ),
		'section' => 'karatasantik_contact',
		'type'    => 'email',
	] );

	// Address
	$wp_customize->add_setting( 'karatasantik_address', [
		'default'           => 'Vilnius, Lietuva',
		'transport'         => 'refresh',
		'sanitize_callback' => 'sanitize_text_field',
	] );
	$wp_customize->add_control( 'karatasantik_address', [
		'label'   => __( 'Address', 'karatasantik' ),
		'section' => 'karatasantik_contact',
		'type'    => 'text',
	] );

	// ═════════════════════════════════════════════
	// Section: Social Media
	// ═════════════════════════════════════════════

	$wp_customize->add_section( 'karatasantik_social', [
		'title'    => __( 'Social Media', 'karatasantik' ),
		'panel'    => 'karatasantik_panel',
		'priority' => 20,
	] );

	// Facebook URL
	$wp_customize->add_setting( 'karatasantik_facebook_url', [
		'default'           => '',
		'transport'         => 'refresh',
		'sanitize_callback' => 'esc_url_raw',
	] );
	$wp_customize->add_control( 'karatasantik_facebook_url', [
		'label'   => __( 'Facebook URL', 'karatasantik' ),
		'section' => 'karatasantik_social',
		'type'    => 'url',
	] );

	// Instagram URL
	$wp_customize->add_setting( 'karatasantik_instagram_url', [
		'default'           => '',
		'transport'         => 'refresh',
		'sanitize_callback' => 'esc_url_raw',
	] );
	$wp_customize->add_control( 'karatasantik_instagram_url', [
		'label'   => __( 'Instagram URL', 'karatasantik' ),
		'section' => 'karatasantik_social',
		'type'    => 'url',
	] );

	// ═════════════════════════════════════════════
	// Section: Top Bar
	// ═════════════════════════════════════════════

	$wp_customize->add_section( 'karatasantik_topbar', [
		'title'    => __( 'Top Bar', 'karatasantik' ),
		'panel'    => 'karatasantik_panel',
		'priority' => 30,
	] );

	// Show / hide toggle
	$wp_customize->add_setting( 'karatasantik_topbar_show', [
		'default'           => 1,
		'transport'         => 'refresh',
		'sanitize_callback' => 'karatasantik_sanitize_checkbox',
	] );
	$wp_customize->add_control( 'karatasantik_topbar_show', [
		'label'   => __( 'Show top bar', 'karatasantik' ),
		'section' => 'karatasantik_topbar',
		'type'    => 'checkbox',
	] );

	// Announcement text
	$wp_customize->add_setting( 'karatasantik_topbar_text', [
		'default'           => '',
		'transport'         => 'refresh',
		'sanitize_callback' => 'sanitize_text_field',
	] );
	$wp_customize->add_control( 'karatasantik_topbar_text', [
		'label'       => __( 'Announcement Text', 'karatasantik' ),
		'description' => __( 'e.g. "Nemokamas pristatymas užsakymams virš 100€"', 'karatasantik' ),
		'section'     => 'karatasantik_topbar',
		'type'        => 'text',
	] );
}
add_action( 'customize_register', 'karatasantik_customize_register' );
