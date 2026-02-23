<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">

	<header id="masthead" class="site-header">
		<div class="container">

			<div class="site-branding">
				<?php
				if ( has_custom_logo() ) :
					the_custom_logo();
				else :
				?>
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-title" rel="home">
						<?php bloginfo( 'name' ); ?>
					</a>
				<?php endif; ?>
			</div>

			<nav id="site-navigation" class="main-navigation" aria-label="<?php esc_attr_e( 'Primary Navigation', 'karatasantik' ); ?>">
				<?php
				wp_nav_menu( [
					'theme_location' => 'primary',
					'menu_id'        => 'primary-menu',
					'container'      => false,
				] );
				?>
			</nav>

		</div>
	</header>

	<div id="content" class="site-content">
