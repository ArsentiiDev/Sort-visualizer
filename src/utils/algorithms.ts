import { Selection } from "d3-selection";

const swapElements = (arr: number[], i: number, j: number) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const bubble_sort = async (
  data: number[],
  sorted: boolean[],
  selection: Selection<SVGSVGElement | null, number, null, undefined> | null,
  setData: React.Dispatch<React.SetStateAction<number[]>>,
  setSorted: React.Dispatch<React.SetStateAction<boolean[]>>,
  stopFlag: any
) => {
  let array = [...data];
  const len = array.length;

  let newSorted = [...sorted];
  for (let n = 0; n < len; n++) {
    for (let i = 0; i < len - n - 1; i++) {
      if (stopFlag.current) {
        stopFlag.current = false;
        return;
      }
      selection?.selectAll("rect").attr("fill", (d, idx) => {
        if (idx === i || idx === i + 1) {
          return "#3498db";
        } else if (newSorted[idx]) {
          return "green";
        } else {
          return "#5d006f";
        }
      });
      await sleep(1);
      if (array[i] > array[i + 1]) {
        swapElements(array, i, i + 1);
        setData([...array]);
        await sleep(1);
      }
    }
    newSorted[len - n - 1] = true;
    setSorted(newSorted);
  }
  selection?.selectAll("rect").attr("fill", "green");
};

export const merge_sort = async (
  data: number[],
  sorted: boolean[],
  selection: Selection<SVGSVGElement | null, number, null, undefined> | null,
  setData: React.Dispatch<React.SetStateAction<number[]>>,
  setSorted: React.Dispatch<React.SetStateAction<boolean[]>>,
  stopFlag: any
) => {
  async function mergeSort(array: number[]): Promise<number[] | any> {
    if (array.length <= 1) {
      return array;
    }
    const middle = Math.floor(array.length / 2);
    const a = array.slice(0, middle);
    const b = array.slice(middle);
    return merge(await mergeSort(a), await mergeSort(b));
  }

  async function merge(a: number[], b: number[]) {
    let i = 0;
    let j = 0;
    if (stopFlag.current) {
      return;
    }
    const sortedArr: number[] = [];
    while (i < a.length && j < b.length) {
      if (a[i] < b[j]) {
        sortedArr.push(a[i]);
        i++;
      } else {
        sortedArr.push(b[j]);
        j++;
      }
    }
    while (i < a.length) {
      sortedArr.push(a[i]);
      i++;
    }
    while (j < b.length) {
      sortedArr.push(b[j]);
      j++;
    }
    for (let k = 0; k < sortedArr.length; k++) {
      data[k] = sortedArr[k];
      setData([...data]);
      selection?.selectAll("rect").attr("fill", (d, idx) => {
        if (idx === k) {
          return "#3498db";
        } else if (sortedArr[idx]) {
          return "green";
        } else {
          return "#5d006f";
        }
      });
      await sleep(30);
    }
    return sortedArr;
  }

  await mergeSort(data);
  if (!stopFlag.current) {
    setSorted([...sorted].fill(true));
    selection?.selectAll("rect").attr("fill", "green");
  }
};

export const quick_sort = async (
  data: number[],
  sorted: boolean[],
  selection: Selection<SVGSVGElement | null, number, null, undefined> | null,
  setData: React.Dispatch<React.SetStateAction<number[]>>,
  setSorted: React.Dispatch<React.SetStateAction<boolean[]>>
) => {
  const newSorted = [...sorted];

  const quickSort = async (
    array: number[],
    start = 0,
    end = array.length - 1
  ) => {
    if (start < end) {
      const pivotIdx = await partition(array, start, end);
      await quickSort(array, start, pivotIdx - 1);
      await quickSort(array, pivotIdx + 1, end);
    }
    return array;
  };

  const partition = async (array: number[], start: number, end: number) => {
    const pivot = array[end];
    let i = start - 1;
    for (let j = start; j < end; j++) {
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    [array[i + 1], array[end]] = [array[end], array[i + 1]];

    for (let index = 0; index < array.length; index++) {
      data[index] = array[index];
    }
    newSorted[i + 1] = true;

    setData([...data]);
    setSorted(newSorted);

    selection
      ?.selectAll("rect")
      .attr("fill", (_, index) => (newSorted[index] ? "green" : "#5d006f"));

    await sleep(150);
    return i + 1;
  };

  await quickSort(data);
  selection?.selectAll("rect").attr("fill", "green");
};

export const heap_sort = async (
  data: number[],
  sorted: boolean[],
  selection: Selection<SVGSVGElement | null, number, null, undefined> | null,
  setData: React.Dispatch<React.SetStateAction<number[]>>,
  setSorted: React.Dispatch<React.SetStateAction<boolean[]>>
) => {
  const newSorted = [...sorted];

  const swapElements = (arr: number[], i: number, j: number) => {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  };

  const buildHeap = async (array: number[]) => {
    const parentIdx = Math.floor((array.length - 2) / 2);
    for (let currIdx = parentIdx; currIdx >= 0; currIdx--) {
      await siftDown(currIdx, array.length - 1, array);
    }
  };

  const siftDown = async (currIdx: number, end: number, array: number[]) => {
    let childOne = currIdx * 2 + 1;
    while (childOne <= end) {
      let childTwo = currIdx * 2 + 2 <= end ? currIdx * 2 + 2 : -1;
      let idxToSwap: number;
      if (childTwo !== -1 && array[childTwo] > array[childOne]) {
        idxToSwap = childTwo;
      } else {
        idxToSwap = childOne;
      }
      if (array[idxToSwap] > array[currIdx]) {
        swapElements(array, idxToSwap, currIdx);
        currIdx = idxToSwap;
        childOne = currIdx * 2 + 1;
        setData([...array]);
        await sleep(30);
      } else {
        return;
      }
    }
  };

  const sortArray = async (array: number[]) => {
    await buildHeap(array);
    for (let endIdx = array.length - 1; endIdx > 0; endIdx--) {
      swapElements(array, 0, endIdx);
      await siftDown(0, endIdx - 1, array);
      setData([...array]);
      newSorted[endIdx + 1] = true;
      setSorted(newSorted);
      selection
        ?.selectAll("rect")
        .attr("fill", (_, index) => (newSorted[index] ? "green" : "#5d006f"));
      await sleep(30);
    }
  };

  await sortArray(data);
  setSorted([...sorted].fill(true));
  selection?.selectAll("rect").attr("fill", "green");
};

export const radix_sort = async (
  data: number[],
  sorted: boolean[],
  selection: Selection<SVGSVGElement | null, number, null, undefined> | null,
  setData: React.Dispatch<React.SetStateAction<number[]>>,
  setSorted: React.Dispatch<React.SetStateAction<boolean[]>>
) => {
  let array = data.slice();
  if (array.length === 0 || array.length === 1) {
    return array;
  }

  const counts = new Array(10).fill(0);
  const sortedArr = new Array(array.length).fill(0);
  let maxNumber = Math.max(...array);
  let d = 0;

  while (maxNumber !== 0) {
    maxNumber = Math.floor(maxNumber / 10);
    d += 1;
  }

  for (let i = 0; i < d; i++) {
    for (let j = array.length - 1; j >= 0; j--) {
      const digit = Math.floor(array[j] / Math.pow(10, i)) % 10;
      counts[digit] += 1;
    }

    for (let x = 1; x < counts.length; x++) {
      counts[x] += counts[x - 1];
    }

    for (let j = array.length - 1; j >= 0; j--) {
      const digit = Math.floor(array[j] / Math.pow(10, i)) % 10;
      counts[digit] -= 1;
      sortedArr[counts[digit]] = array[j];
    }

    array = sortedArr.slice();
    setData([...array]);
    await sleep(350);
    sortedArr.fill(0);
    counts.fill(0);
  }

  return array;
};
