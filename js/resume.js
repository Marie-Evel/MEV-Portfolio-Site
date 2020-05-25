var Resume = function() {
  const $pdf = $('.resume-container embed');

  const refreshPdfFit = function() {
    const srcFile = 'files/mev_resume.pdf';
    let srcView = '',
        targetSrc = '';

    if (window.innerWidth < 850) {
      srcView = '#view=fitH';
    }

    targetSrc = srcFile + srcView
    if ( targetSrc !== $pdf.attr('src') ) {
      $pdf.attr('src',targetSrc);
    }

  };

  return {
    refreshPdfFit: refreshPdfFit
  };

} ();

$(document).ready(function() {
  Resume.refreshPdfFit();
});

// window.addEventListener('resize', function() {
//   Resume.refreshPdfFit();
// });
