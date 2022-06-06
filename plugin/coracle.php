<?php

/*
 * Plugin Name: Coracle
 * Description: Adds various WordPress customizations for vietnamcoracle.com
 * Author: Benjamin Knight
 */

// Custom widget areas
function coracle__widgets_init()
{
	register_sidebar([
		"name" => "Sticky Header",
		"id" => "header_1",
		"before_widget" => '<div id="header-1" class="header-1 widget-area" role="complementary">',
		"after_widget" => "</div>",
	]);
	register_sidebar([
		"name" => "Sticky Header Preview",
		"id" => "header_1_preview",
		"before_widget" =>
			'<div id="header-1" class="header-1 header-1-preview widget-area" role="complementary"">',
		"after_widget" => "</div>",
	]);
}
add_action("widgets_init", "coracle__widgets_init");

// GIF optimization
function coracle__optimize_gifs($buffer)
{
	if (is_admin()) {
		return $buffer;
	}
	$placeholder = htmlspecialchars(
		'data:image/svg+xml,<svg viewBox="0 0 1000 100" xmlns="http://www.w3.org/2000/svg"></svg>',
	);
	return preg_replace(
		'/<img [^>]*src=[\'"]([^\'"]*\.gif)[^>]*>/i',
		"<img loading=\"lazy\" class=\"native-lazyload-js-fallback\" data-src=\"$1\" src=\"$placeholder\">",
		$buffer,
	);
}

function coracle__init()
{
	ob_start("coracle__optimize_gifs");
}

function coracle__shutdown()
{
	if (ob_get_length()) {
		ob_end_flush();
	}
}

// NOTE(2021-06-13): Disabling below actions since there aren't really any ads
// add_action("init", "coracle__init");
// add_action("shutdown", "coracle__shutdown");

// Get rid of unneeded scripts
function coracle__wp_print_scripts()
{
	wp_dequeue_script("twitter-intent-api");
}
add_action("wp_print_scripts", "coracle__wp_print_scripts", 100);

// Inject ads in post content
// Overrides adrotate's adrotate_inject_ads function

// Also make sure to disable AdRotate's ad injection to avoid mixed results
remove_filter("the_content", "adrotate_inject_posts", 12);
add_filter("the_content", "coracle__inject_ads", 10, 1);

function coracle__inject_ads($post_content)
{
	global $wpdb, $post, $adrotate_config;
	$custom_fields = get_post_custom();
	if ($custom_fields["coracle_disable_ad_injection"][0] === "1") {
		return $post_content;
	}
	$current_user = wp_get_current_user();
	$show_preview = $current_user->user_login === "apipreview";
	$preview_groups = [35, 36, 37, 38];
	$group_array = [];
	if (is_page()) {
		// Inject ads into page
		$group_rows = $wpdb->get_results(
			"SELECT id, page, page_loc, page_par, cat, cat_loc, cat_par FROM {$wpdb->prefix}adrotate_groups WHERE page_loc > 0 AND page_loc < 5 ORDER BY name;",
		);
		foreach ($group_rows as $row) {
			$pages = explode(",", $row->page);
			if (!is_array($pages)) {
				$pages = [];
			}
			$show_group = false;
			if ($show_preview) {
				$show_group = in_array($row->id, $preview_groups);
			} else {
				$show_group = in_array($post->ID, $pages);
			}
			if ($show_group) {
				$group_array[$row->id] = [
					"location" => $row->page_loc,
					"paragraph" => $row->page_par,
					"ids" => $pages,
				];
			}
		}
	}
	if (is_single()) {
		// Inject ads into posts in specified category
		$group_rows = $wpdb->get_results(
			"SELECT id, page, page_loc, page_par, cat, cat_loc, cat_par FROM {$wpdb->prefix}adrotate_groups WHERE cat_loc > 0 AND cat_loc < 5 ORDER BY name;",
		);
		$wp_categories = get_terms("category", ["fields" => "ids"]);
		foreach ($group_rows as $row) {
			$categories = explode(",", $row->cat);
			if (!is_array($categories)) {
				$categories = [];
			}
			$show_group = false;
			if ($show_preview) {
				$show_group = in_array($row->id, $preview_groups);
			} else {
				foreach ($wp_categories as &$value) {
					if (in_array($value, $categories)) {
						$show_group = true;
					}
				}
			}
			if ($show_group) {
				$group_array[$row->id] = [
					"location" => $row->cat_loc,
					"paragraph" => $row->cat_par,
					"ids" => $categories,
				];
			}
		}
	}
	$paragraph_top_offset = 2;
	$paragraph_skip_count = 2;
	$before = $after = 0;
	$injection_ads = [];
	foreach ($group_array as $group_id => $group) {
		$advert_output = adrotate_group($group_id);
		// Advert in front of content
		if (($group["location"] == 1 or $group["location"] == 3) and $before == 0) {
			$post_content = $advert_output . $post_content;
			$before = 1;
		}
		// Advert behind the content
		if (($group["location"] == 2 or $group["location"] == 3) and $after == 0) {
			$post_content = $post_content . $advert_output;
			$after = 1;
		}
		// Adverts inside the content
		if ($group["location"] == 4) {
			preg_match_all(
				"/<\s*a[^>]*>.*?<\s*\/\s*a>/",
				preg_replace('/\r|\n/', "", $advert_output),
				$ads_array,
			);
			$ads_array = array_shift($ads_array);
			$injection_ads = array_merge($injection_ads, $ads_array);
		}
	}
	if (count($injection_ads) > 0) {
		$debug = 0;
		$ad_counter = 0;
		$paragraphs = explode("</p>", $post_content);
		$paragraph_count = count($paragraphs);
		$big_paragraph_counter = -1;
		for ($i = 0; $i < $paragraph_count; $i++) {
			$paragraph = $paragraphs[$i];
			$paragraph_size = strlen(strip_tags($paragraph));
			$is_big_paragraph =
				$paragraph_size >= 280 || strpos($paragraph, 'class="wp-image-') > 0;
			$is_map = strpos($paragraph, 'name="map"') > 0 || strpos($paragraph, 'id="map"') > 0;
			if ($is_big_paragraph && !$is_map) {
				$big_paragraph_counter += 1;
			}
			if (trim($paragraph)) {
				$paragraphs[$i] .= "</p>";
				if ($debug) {
					$comment = "<!-- p count: $i, big p count: $big_paragraph_counter, p size: $paragraph_size, p: $paragraph -->";
					$paragraphs[$i] .= $comment;
				}
			}
			if (
				$big_paragraph_counter >= $paragraph_top_offset &&
				($big_paragraph_counter - $paragraph_top_offset) % $paragraph_skip_count === 0
			) {
				$ad_html = array_shift($injection_ads);
				if ($ad_html) {
					$ad_counter += 1;
					$paragraphs[$i] .= <<<HTML
					<div class="selected-resources" id="selected-resources-$ad_counter">
						<small>
							Selected Resources
							<a href="/about/#ads" target="_blank">
								What’s this?
							</a>
						</small>
						$ad_html
					</div>
					HTML;
					$paragraph_top_offset = $big_paragraph_counter + $paragraph_skip_count;
				}
			}
		}
		$post_content = implode("", $paragraphs);
	}
	return $post_content;
	// --- OLD IMPLEMENTATION (Ported from Carl's jQuery code to PHP) ---
	//   $paragraph_top_offset = 12;
	//   $paragraph_skip_count = 5;
	//   $paragraphs = explode('</p>', $post_content);
	//   $paragraph_count = count($paragraphs);
	//   $pattern = '/<\s*a[^>]*>.*?<\s*\/\s*a>/';
	//   preg_match_all(
	//     $pattern,
	//     preg_replace('/\r|\n/', '', adrotate_group('17')),
	//     $premium_ads_xl
	//   );
	//   preg_match_all(
	//     $pattern,
	//     preg_replace('/\r|\n/', '', adrotate_group('14')),
	//     $premium_ads
	//   );
	//   preg_match_all(
	//     $pattern,
	//     preg_replace('/\r|\n/', '', adrotate_group('12')),
	//     $standard_ads
	//   );
	//   $premium_ads_xl = array_shift($premium_ads_xl);
	//   $premium_ads = array_shift($premium_ads);
	//   $standard_ads = array_shift($standard_ads);
	//   for (
	//     $i = $paragraph_top_offset;
	//     $i < $paragraph_count;
	//     $i = $i + $paragraph_skip_count
	//   ) {
	//     if (trim($paragraphs[$i])) {
	//       $paragraphs[$i] .= '</p>';
	//     }
	//     if ($ad_html = array_shift($premium_ads_xl)) {
	//       $classname = 'premium_xl';
	//     } elseif ($ad_html = array_shift($premium_ads)) {
	//       $classname = 'premium';
	//     } elseif ($ad_html = array_shift($standard_ads)) {
	//       $classname = 'standard';
	//       if ($ad_html_2 = array_shift($standard_ads)) {
	//         $ad_html .= $ad_html_2;
	//       }
	//     }
	//     if ($ad_html) {
	//       $paragraphs[$i] .= <<<HTML
	// <!-- injected ad, index $i -->
	// <div class="in_article_ad in_article_ad--$classname">
	//   <hr />
	//   <small>Selected Resources</small>
	//   <a class="in_article_ad_whats_this" href="/about-2/#ads">
	//     <small>What’s this?</small>
	//   </a>
	//   <div class="in_article_ad_container">$ad_html</div>
	//   <hr />
	// </div>
	// HTML;
	//     }
	//   }
	//   $post_content = implode('', $paragraphs);
	//   return $post_content;
}

// See: https://www.advancedcustomfields.com/resources/customize-the-wysiwyg-toolbars/
function coracle__acf_toolbars($toolbars)
{
	if (($forecolor_key = array_search("forecolor", $toolbars["Full"][2])) !== false) {
		$insertion_point = $forecolor_key + 1;
		$toolbars["Full"][2] = array_merge(
			array_slice($toolbars["Full"][2], 0, $insertion_point, true),
			["backcolor"],
			array_slice(
				$toolbars["Full"][2],
				$insertion_point,
				count($toolbars["Full"][2]) - $insertion_point,
				true,
			),
		);
	}

	return $toolbars;
}

// NOTE(2021-06-13): Disabling because I don't think it's necessary anymore?
// add_filter("acf/fields/wysiwyg/toolbars", "coracle__acf_toolbars");

function coracle__acf_modify_wysiwyg_height()
{
	// Shorten wysiwyg height on homepage slides
	?><style>
    .acf-field-5f40e43f0185a iframe {
      height: 140px !important;
      min-height: auto !important;
    }
  </style><?php
}

// NOTE(2021-06-13): Disabling because I don't think it's necessary anymore?
// add_action("acf/input/admin_head", "coracle__acf_modify_wysiwyg_height");

function coracle__register_post_types()
{
	register_post_type("block", [
		"exclude_from_search" => true,
		"graphql_single_name" => "block",
		"graphql_plural_name" => "blocks",
		"labels" => [
			"edit_item" => "Edit Block",
			"name" => "Blocks",
			"new_item" => "New Block",
			"singular_name" => "Block",
		],
		"menu_icon" => "dashicons-screenoptions",
		"menu_position" => 20,
		"public" => false,
		"show_ui" => true,
		"show_in_graphql" => true,
		"show_in_menu" => true,
		"show_in_nav_menus" => false,
		"supports" => ["custom-fields", "revisions", "title"],
	]);
}

add_action("init", "coracle__register_post_types");

function coracle__wp_enqueue_scripts()
{
	wp_enqueue_style(plugin_dir_url(__FILE__) . "styles/blocks.css");
}

add_action("wp_enqueue_scripts", "coracle__wp_enqueue_scripts");

add_filter("rest_authentication_errors", function ($result) {
	// If a previous authentication check was applied,
	// pass that result along without modification.
	if (true === $result || is_wp_error($result)) {
		return $result;
	}

	// No authentication has been performed yet.
	// Return an error if user is not logged in.
	if (!is_user_logged_in()) {
		return new WP_Error("rest_not_logged_in", __("You are not currently logged in."), [
			"status" => 401,
		]);
	}

	// Our custom authentication check should have no effect
	// on logged-in requests
	return $result;
});

// Fix repeater sub-fields not showing in parent
// https://github.com/wp-graphql/wp-graphql-acf/issues/200
/* add_filter(
	"graphql_resolve_revision_meta_from_parent",
	function ($should, $object_id, $meta_key, $single) {
		if (preg_match("/(\w+)_\d_\w+/", $meta_key, $matches)) {
			return false;
		}
		return $should;
	},
	20,
	4
); */

// Add Custom Related Posts to GraphQL schema
add_action("graphql_register_types", function () {
	register_graphql_connection([
		"fromType" => "ContentNode",
		"toType" => "ContentNode",
		"fromFieldName" => "customRelatedPosts",
		"resolve" => function (\WPGraphQL\Model\Post $source, $args, $context, $info) {
			if (!class_exists("CustomRelatedPosts")) {
				return;
			}
			$resolver = new \WPGraphQL\Data\Connection\PostObjectConnectionResolver(
				$source,
				$args,
				$context,
				$info,
				"any",
			);
			$post_ids = array_keys(CustomRelatedPosts::get()->relations_to($source->ID));
			if (empty($post_ids)) {
				return;
			}
			$resolver->set_query_arg("post__in", $post_ids);
			return $resolver->get_connection();
		},
	]);
	register_graphql_fields("ContentNode", [
		"patreonLevel" => [
			"type" => "Int",
			"resolve" => function ($root, $args, $context, $info) {
				return (int) get_post_meta($root->ID, "patreon-level", true);
			},
		],
		"patreonTotalPatronageLevel" => [
			"type" => "Int",
			"resolve" => function ($root, $args, $context, $info) {
				return (int) get_post_meta($root - ID, "patreon-total-patronage-level", true);
			},
		],
		"patreonActivePatronsOnly" => [
			"type" => "Boolean",
			"resolve" => function ($root, $args, $context, $info) {
				return (bool) get_post_meta($root - ID, "patreon-active-patrons-only", true);
			},
		],
	]);
	// Temporary fix for global stylesheet added in WordPress 5.9:
	// https://github.com/wp-graphql/wp-graphql/issues/2259
	register_graphql_field("RootQuery", "globalStylesheet", [
		"type" => "String",
		"resolve" => function () {
			return wp_get_global_stylesheet([]);
		},
	]);
});

// Optimize responsive images "size" attribute
add_filter(
	"wp_calculate_image_sizes",
	function ($sizes, $size) {
		$maxWidth = 768;
		if (defined("GRAPHQL_REQUEST") && GRAPHQL_REQUEST) {
			$maxWidth = 864;
		}
		if (isset($size[0])) {
			$maxWidth = min($size[0], $maxWidth);
		}
		return "(max-width: ${maxWidth}px) 100vw, ${maxWidth}px";
	},
	10,
	2,
);

// Register header menu for Next
add_action("init", function () {
	register_nav_menu("header-menu-next", __("Header Menu (Next)"));
	add_post_type_support("page", "excerpt");
});

// https://www.wpgraphql.com/filters/graphql_html_entity_decoding_enabled/
add_filter("graphql_html_entity_decoding_enabled", "__return_true");

// Don't show password-protected posts in search results
add_filter("posts_where", function ($where = "") {
	if (!is_single() && !is_admin()) {
		$where .= " AND post_password = ''";
	}
	return $where;
});

add_filter("graphql_access_control_allow_headers", function ($allowed_headers) {
	$allowed_headers[] = "X-Coracle-Post-Password";
	return $allowed_headers;
});

add_filter(
	"graphql_object_visibility",
	function ($visibility, $model_name, $data) {
		$header_key = "HTTP_X_CORACLE_POST_PASSWORD";
		if (
			$visibility === "restricted" &&
			$model_name === "PostObject" &&
			isset($_SERVER[$header_key])
		) {
			$client_password = $_SERVER[$header_key];
			if ($client_password === $data->post_password) {
				$visibility = "public";
			}
		}
		return $visibility;
	},
	10,
	3,
);

add_action("rest_api_init", function () {
	$origin = get_http_origin();
	if (
		$origin === "http://localhost:3000" ||
		preg_match('/.*vietnamcoracle\.com$/', $origin) ||
		preg_match('/.*vietnamcoracle\.vercel\.app$/', $origin)
	) {
		// You can set more specific domains if you need
		header("Access-Control-Allow-Origin: " . $origin);
		header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
		header("Access-Control-Allow-Credentials: true");
		header("Access-Control-Allow-Headers: Authorization");

		if ("OPTIONS" === $_SERVER["REQUEST_METHOD"]) {
			status_header(200);
			exit();
		}
	}
});

// NOTE(ben|2021-12-29):
// For some reason this filter doesn't work on the REST API, so it can't replace the "rest_api_init" hook above.
// This is however necessary for cross-site requires to admin-ajax.php (necessary for ad tracking, for example)
add_filter(
	"allowed_http_origin",
	function ($origin, $origin_arg) {
		if (
			$origin_arg === "http://localhost:3000" ||
			preg_match('/.*vietnamcoracle\.com$/', $origin_arg) ||
			preg_match('/.*vietnamcoracle\.vercel\.app$/', $origin_arg)
		) {
			$origin = $origin_arg;
		}
		return $origin;
	},
	10,
	2,
);

add_filter(
	"acf/pre_load_post_id",
	function ($null, $post_id) {
		if (is_preview()) {
			return get_the_ID();
		} else {
			$acf_post_id = isset($post_id->ID) ? $post_id->ID : $post_id;

			if (!empty($acf_post_id)) {
				return $acf_post_id;
			} else {
				return $null;
			}
		}
	},
	10,
	2,
);

add_filter(
	"preview_post_link",
	function ($preview_link, $post) {
		return add_query_arg(
			[
				"redirect" => "/" . urlencode($post->post_name),
				"secret" => "EckDg5dwCcwqJH6U",
			],
			"https://www.vietnamcoracle.com/api/preview",
		);
	},
	10,
	2,
);

if (function_exists("acf_add_options_page")) {
	acf_add_options_page([
		"capability" => "edit_posts",
		"menu_slug" => "default-images",
		"menu_title" => __("Default Images"),
		"page_title" => __("Default Images"),
		"parent_slug" => "themes.php",
		"position" => 0,
		"show_in_graphql" => true,
	]);
}

// Remove certain shortcodes when rendering content for GraphQL
add_action("do_graphql_request", function () {
	remove_shortcode("mc4wp_form");
	remove_shortcode("shareaholic");
	remove_shortcode("custom-related-posts");
});

// Increase page size maximum
// https://www.wpgraphql.com/filters/graphql_connection_max_query_amount
add_filter("graphql_connection_max_query_amount", function () {
	return 1000;
});

// Rebuild site when redirects are updated
function coracle__update_redirects()
{
	wp_remote_post(
		"https://api.vercel.com/v1/integrations/deploy/QmYHtkC3ZMNx7CucDSQicEynNzn7zZP2Lw2d9Tgimzr4kv/bLUnOAGfZh",
	);
}
add_action("redirection_redirect_deleted", "coracle__update_redirects");
add_action("redirection_redirect_updated", "coracle__update_redirects");

// Redirect preview page to Next preview
add_action("template_redirect", function () {
	// Exceptions for AJAX, Cron, or WP-CLI requests
	if (
		(defined("DOING_AJAX") && DOING_AJAX) ||
		(defined("DOING_CRON") && DOING_CRON) ||
		(defined("WP_CLI") && WP_CLI)
	) {
		return;
	}
	// Exceptions for logged in users, WP admin, and RSS feed
	if (is_user_logged_in() || is_admin() || is_feed()) {
		return;
	}
	if (isset($_GET["preview"]) && $_GET["preview"] == true) {
		$redirect = add_query_arg(
			[
				"redirect" => urlencode("/post?p=" . $_GET["p"]),
				"secret" => "EckDg5dwCcwqJH6U",
			],
			"https://www.vietnamcoracle.com/api/preview",
		);
		wp_redirect($redirect);
	} else {
		$redirect = "https://www.vietnamcoracle.com" . $_SERVER["REQUEST_URI"];
		wp_redirect($redirect, 301);
	}
});

add_action(
	"edit_post",
	function ($post_id, $post) {
		wp_remote_get(
			"https://www.vietnamcoracle.com/api/revalidate?secret=EckDg5dwCcwqJH6U&path=/{$post->post_name}",
		);
	},
	10,
	2,
);

add_action("edit_comment", function ($comment_id) {
	$comment = get_comment($comment_id);
	$post = get_post($comment->comment_post_ID);
	wp_remote_get(
		"https://www.vietnamcoracle.com/api/revalidate?secret=EckDg5dwCcwqJH6U&path=/{$post->post_name}",
	);
});
