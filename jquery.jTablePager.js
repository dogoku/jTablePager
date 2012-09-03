(function ($) {

	$.jTablePager = function (element, options) {

		var defaults = {
			container: 'jTablePager',
			pagerSize: 10,
			pagerClass: 'pager',
			hasHeader: false
		};

		var plugin = this;

		plugin.settings = {};

		var $element = $(element),
			$container = null,
			$loaded = false
		
		function createPages(pageSize, pagerClass) {
			
			var rowCount = $element.find('tbody > tr').length;
			if (plugin.settings.hasHeader) rowCount -= 1;
			
			for (var r = 1; r < rowCount + pageSize; r += pageSize) {
				var to = r + pageSize - 1;
				if (to > rowCount) to = rowCount;
				if (r <= to) {
					var a = $("<a class='pager-links' href='#'></a>").text((Math.floor(r/pageSize) + 1)).data('page-from',r).data('page-to',to);
					$container.find('.' + pagerClass).append(a);
				}
			}
			
			//Bind click handler for pager links
			$container.on('click','a.pager-links',function (e) {
				e.preventDefault();
				var link = $(this);
				showPage(link.data('page-from'),link.data('page-to'));
			});
			
		}
		
		function showPage(start, stop) {
			var rows = 0;
			$element.find('tbody > tr').hide().each(function (i, tr) {
				if (i == 0 && plugin.settings.hasHeader) $(this).show().addClass('header');
				if ($(this).is(":hidden")) {
					rows++;
					if ((rows >= start) & (rows <= stop))
						$(this).show();
				}
			});
		}

		plugin.init = function () {
			plugin.settings = $.extend({}, defaults, options);
			//Create container html
			$element.wrap("<div class='" + plugin.settings.container + "'></div>");
			$container = $element.parent();
			$container.append("<div class='" + plugin.settings.pagerClass + "'></div>");
			
			
			//Create pages
			createPages(plugin.settings.pagerSize, plugin.settings.pagerClass);
			//Trigger first link
			$container.find('a.pager-links:first').trigger('click');
		};

		plugin.destroy = function () {
			//remove pager
			$container.find("." + plugin.settings.pagerClass).remove();
			//move element out of container
			$element.unwrap("." + plugin.settings.container);
			//remove container
			$container.remove();
			//show all rows
			$element.find('tbody > tr').show()
			//Remove all data
			$element.removeData('jTablePager');
		};

		plugin.init();

	};

	$.fn.jTablePager = function (options) {

		return this.each(function () {
			if (undefined === $(this).data('jTablePager')) {
				var plugin = new $.jTablePager(this, options);
				$(this).data('jTablePager', plugin);
			}
		});

	};

})(jQuery);