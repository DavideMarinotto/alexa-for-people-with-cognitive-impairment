(function () {

    function getCellValue(tr, idx) {
        return tr.children[idx].textContent;
    }

    function createComparer(idx, asc) {
        return function (a, b) {
            var v1 = getCellValue(asc ? a : b, idx),
                v2 = getCellValue(asc ? b : a, idx);
            if (v1 === '' || v2 === '' || isNaN(v1) || isNaN(v2)) {
                return v1.toString().localeCompare(v2);
            }
            return v1 - v2;
        };
    }

    document.querySelectorAll('th.sortable').forEach(function (th) {
        th.addEventListener('click', function () {
            var table = th.closest('table'); // get the closest table tag
            Array.from(table.querySelectorAll('tbody > tr'))
                .sort(createComparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
                .forEach(function (tr) {
                    table.querySelector('tbody').appendChild(tr)
                });
        });
    });
})();
