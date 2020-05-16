var Lightbox = function() {
  $.featherlight.prototype.afterContent = function () {
      const $content = this.$instance.find('.featherlight-content')[0],
            captionText = this.$currentTarget.find('img').attr('title'),
            $captionElement = this.$instance.find('.featherlight-caption'),
            maxWidth = $($content).width() + 40;
            $slideNumElement = this.$instance.find('.featherlight-slide-number'),
            $closeButton = this.$instance.find('.featherlight-close-icon'),
            $gallery = this.$currentTarget.parents('div[data-featherlight-gallery]');

      $closeButton.html('<span class="far fa-times"></span>');
      $slideNumElement.remove();

      if ($gallery.length) {
        const $prevButton = this.$instance.find('.featherlight-previous'),
              $nextButton = this.$instance.find('.featherlight-next'),

              $slides = $gallery.find('a'),
              slideCount = $slides.length,
              curSlideNum = $slides.index(this.$currentTarget) + 1;

        $prevButton.html('<span class="far fa-chevron-left"></span>');
        $nextButton.html('<span class="far fa-chevron-right"></span>');

        $('<div class="featherlight-slide-number">').text(curSlideNum + ' / ' + slideCount).appendTo($content);
      }

      $captionElement.remove();
      $('<div class="featherlight-caption">').text(captionText).appendTo($content);

  }
} ();
