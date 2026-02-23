<?php
/**
 * Karatas Antik — Fallback Index Template
 *
 * Used when no other template matches the current request.
 *
 * @package karatasantik
 */

get_header(); ?>

<main id="main" class="site-main">
	<div class="container">

		<?php if ( have_posts() ) : ?>

			<?php while ( have_posts() ) : the_post(); ?>
				<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
					<header class="entry-header">
						<h2 class="entry-title">
							<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
						</h2>
					</header>
					<div class="entry-summary">
						<?php the_excerpt(); ?>
					</div>
				</article>
			<?php endwhile; ?>

			<?php the_posts_navigation(); ?>

		<?php else : ?>

			<p><?php esc_html_e( 'No content found.', 'karatasantik' ); ?></p>

		<?php endif; ?>

	</div>
</main>

<?php get_footer();
