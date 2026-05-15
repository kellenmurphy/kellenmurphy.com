(function () {
  var CELL = 10, GAP = 3, STEP = 13;
  var LEFT_PAD = 28, TOP_PAD = 32;

  var LIGHT = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
  var DARK  = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  var LIGHT_BORDER = '#d0d7de';
  var DARK_BORDER  = '#30363d';
  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function level(n) {
    return n === 0 ? 0 : n <= 3 ? 1 : n <= 6 ? 2 : n <= 9 ? 3 : 4;
  }

  function render(data) {
    var el = document.getElementById('github-activity');
    if (!el) return;

    var dark = document.documentElement.classList.contains('dark');
    var palette = dark ? DARK : LIGHT;
    var border = dark ? DARK_BORDER : LIGHT_BORDER;
    var labelFill = dark ? '#8b949e' : '#666';
    var weeks = data.weeks;
    var W = LEFT_PAD + weeks.length * STEP;
    var H = TOP_PAD + 7 * STEP;

    var monthSVG = '', lastMonth = -1;
    weeks.forEach(function (week, wi) {
      if (!week.contributionDays.length) return;
      var m = new Date(week.contributionDays[0].date + 'T12:00:00Z').getUTCMonth();
      if (m !== lastMonth) {
        monthSVG += '<text x="' + (LEFT_PAD + wi * STEP) + '" y="' + (TOP_PAD - 6) +
          '" font-size="10" fill="' + labelFill + '" font-family="system-ui,sans-serif">' + MONTHS[m] + '</text>';
        lastMonth = m;
      }
    });

    var dayLabelSVG = [[1,'Mon'],[3,'Wed'],[5,'Fri']].map(function (pair) {
      return '<text x="' + (LEFT_PAD - 4) + '" y="' + (TOP_PAD + pair[0] * STEP + CELL - 1) +
        '" text-anchor="end" font-size="9" fill="' + labelFill + '" font-family="system-ui,sans-serif">' + pair[1] + '</text>';
    }).join('');

    var cellSVG = '';
    weeks.forEach(function (week, wi) {
      week.contributionDays.forEach(function (day) {
        var x = LEFT_PAD + wi * STEP;
        var y = TOP_PAD + day.weekday * STEP;
        var lv = level(day.contributionCount);
        var tip = day.contributionCount + (day.contributionCount === 1 ? ' contribution on ' : ' contributions on ') + day.date;
        cellSVG += '<rect x="' + x + '" y="' + y + '" width="' + CELL + '" height="' + CELL +
          '" rx="2" fill="' + palette[lv] + '" stroke="' + border + '" stroke-width="0.5"><title>' + tip + '</title></rect>';
      });
    });

    var headerSVG = '<text x="6" y="11" font-size="9" fill="' + labelFill +
      '" font-family="system-ui,sans-serif" font-weight="600">GitHub Activity</text>';

    el.innerHTML =
      '<a href="https://github.com/kellenmurphy" target="_blank" rel="noopener" class="gh-activity-wrap" aria-label="GitHub contribution activity — view profile">' +
      '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto;" role="img" aria-label="GitHub contribution heatmap for the last year">' +
      headerSVG + monthSVG + dayLabelSVG + cellSVG +
      '</svg></a>' +
      '<p class="gh-activity-total"><small><a href="https://github.com/kellenmurphy" target="_blank" rel="noopener">' +
      data.total_contributions.toLocaleString() + ' contributions in the last year</a></small></p>';
  }

  var cached = null;
  function init() {
    if (cached) { render(cached); return; }
    fetch('/assets/data/github-activity.json')
      .then(function (r) { return r.json(); })
      .then(function (d) { cached = d; render(d); })
      .catch(function () {
        var el = document.getElementById('github-activity');
        if (el) el.style.display = 'none';
      });
  }

  new MutationObserver(init).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('DOMContentLoaded', init);
})();
