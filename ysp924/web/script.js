var quickSort = function (arr) {
    if (arr.length <= 1) return arr;
    return quickSortHelper(arr, 0, arr.length - 1);
}

function quickSortHelper(arr, left, right) {
    if (left < right) {
        let pivotIndex = partition(arr, left, right);
        quickSortHelper(arr, left, pivotIndex - 1);
        quickSortHelper(arr, pivotIndex + 1, right);
    }
    return arr;
}

var partition = function (arr, left, right) {
    let pivot = arr[left];
    let i = left + 1;
    let j = right;
    while (true) {
        while (i <= j && arr[i] <= pivot) {
            i++;
        }
        while (i <= j && arr[j] > pivot) {
            j--;
        }
        if (i >= j) break;
        // 交换元素
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // 将基准元素放到合适位置
    [arr[left], arr[j]] = [arr[j], arr[left]];
    return j;
}
// 时间O(nlogn)
// 空间O(n)
// 不稳定