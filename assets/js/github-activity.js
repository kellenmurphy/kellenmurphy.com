(function () {
  var CELL = 10, GAP = 3, STEP = 13;
  var LEFT_PAD = 28, TOP_PAD = 20;

  var LIGHT = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
  var DARK  = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function level(n) {
    return n === 0 ? 0 : n <= 3 ? 1 : n <= 6 ? 2 : n <= 9 ? 3 : 4;
  }

  function render(data) {
    var el = document.getElementById('github-activity');
    if (!el) return;

    var dark = document.documentElement.classList.contains('dark');
    var palette = dark ? DARK : LIGHT;
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
          '" rx="2" fill="' + palette[lv] + '"><title>' + tip + '</title></rect>';
      });
    });

    el.innerHTML =
      '<p class="gh-activity-total">' + data.total_contributions.toLocaleString() + ' contributions in the last year</p>' +
      '<div class="gh-activity-wrap"><svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">' +
      monthSVG + dayLabelSVG + cellSVG +
      '</svg></div>';
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
