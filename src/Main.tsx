import {
  Box,
  Flex,
  Heading,
  VStack,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { ChevronDownIcon, RepeatIcon } from "@chakra-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import Bars from "./Bars";
import { max } from "d3-array";
import { Selection, select } from "d3-selection";
import { scaleLinear, scaleBand } from "d3-scale";
import {
  bubble_sort,
  heap_sort,
  merge_sort,
  quick_sort,
  radix_sort,
} from "./utils/algorithms";

type Props = {};

const Main = (props: Props) => {
  const [algorithm, setAlgorithm] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(100);
  const [inProgress, setInProgress] = useState(false);
  const stopFlag = useRef(false);
  const initialData = Array.from({ length: sliderValue }, () =>
    Math.floor(Math.random() * 2000 + 20)
  );
  const [sorted, setSorted] = useState<boolean[]>(
    new Array(sliderValue).fill(false)
  );
  const [data, setData] = useState<number[]>(initialData);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 1000,
    height: 100,
  });
  const ref = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selection, setSelection] = useState<Selection<
    SVGSVGElement | null,
    number,
    null,
    undefined
  > | null>(null);
  let y = scaleLinear()
    .domain([0, max(data, (d) => d)!])
    .range([dimensions.height, 0]);

  let x = scaleBand()
    .domain(data.map((_, i) => i.toString()))
    .range([0, dimensions.width])
    .paddingInner(0.5)
    .paddingOuter(0.3);

  const algorithms = [
    "Bubble Sort",
    "Merge Sort",
    "Quick Sort",
    "Heap Sort",
    "Radix Sort",
  ];

  const resetToDefaults = () => {
    if (inProgress) {
      setInProgress(false);
      stopFlag.current = true;
    }
    setSliderValue(100);
    setData(
      Array.from({ length: 100 }, () => Math.floor(Math.random() * 2000 + 20))
    );
    setSorted(new Array(100).fill(false));
  };

  useEffect(() => {
    // Reset to defaults when the algorithm is switched
    resetToDefaults();
  }, [algorithm]);

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    setData(
      Array.from({ length: value }, () => Math.floor(Math.random() * 2000 + 20))
    );
    setSorted(new Array(value).fill(false));
  };

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
    if (!selection) {
      setSelection(select(ref.current));
    } else {
      // Update scales
      y.domain([0, max(data, (d) => d)!]);
      x.domain(data.map((_, i) => i.toString()));

      const rects = selection
        .selectAll<SVGRectElement, number[]>("rect")
        .data(data);

      rects.exit().remove();

      rects
        .attr("width", x.bandwidth)
        .attr("height", (d) => dimensions.height - y(d))
        .attr("x", (_, i) => x(i.toString())!)
        .attr("y", (d) => y(d));
      if (!inProgress) {
        rects.attr("fill", "#5d006f");
      }

      rects
        .enter()
        .append("rect")
        .attr("width", x.bandwidth)
        .attr("height", (d) => dimensions.height - y(d))
        .attr("x", (_, i) => x(i.toString())!)
        .attr("y", (d) => y(d))
        .attr("fill", "#5d006f");
    }
  }, [selection, data]);

  const visualizeSorting = async () => {
    setInProgress(true);
    const algorithmName = algorithm?.toLowerCase().split(" ").join("_");
    if (algorithmName === "bubble_sort") {
      await bubble_sort(data, sorted, selection, setData, setSorted, stopFlag);
    } else if (algorithmName === "merge_sort") {
      await merge_sort(data, sorted, selection, setData, setSorted, stopFlag);
    } else if (algorithmName === "quick_sort") {
      await quick_sort(data, sorted, selection, setData, setSorted);
    } else if (algorithmName === "heap_sort") {
      await heap_sort(data, sorted, selection, setData, setSorted);
    } else if (algorithmName === "radix_sort") {
      await radix_sort(data, sorted, selection, setData, setSorted);
    }
    setInProgress(false);
  };

  const handleStopAlgorithm = () => {
    setInProgress(false);
    stopFlag.current = true;
    setSliderValue(sliderValue);
    setData(
      Array.from({ length: sliderValue }, () =>
        Math.floor(Math.random() * 2000 + 20)
      )
    );
    setSorted(new Array(sliderValue).fill(false));
  };

  return (
    <Box h="full">
      <VStack h="full">
        <Flex
          mr={4}
          alignItems={"center"}
          justify={"center"}
          gap={"50px"}
          minW={"100vw"}
        >
          <Menu>
            <MenuButton
              minW={"fit-content"}
              as={Button}
              fontSize="lg"
              rightIcon={<ChevronDownIcon />}
            >
              Choose an algorithm:
            </MenuButton>
            <MenuList>
              {algorithms.map((al, index) => (
                <MenuItem key={index} onClick={() => setAlgorithm(al)}>
                  {al}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Box>
            <Text fontSize={"2xl"}>Size of the bars: {sliderValue}</Text>
            <Slider
              aria-label="slider-ex-1"
              defaultValue={30}
              max={500}
              min={1}
              w={"20vw"}
              onChange={handleSliderChange}
              isDisabled={false}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
          <Button
            w={"15%"}
            onClick={visualizeSorting}
            colorScheme="red"
            isDisabled={algorithm ? false : true}
          >
            Visualize
          </Button>
          <Button
            onClick={resetToDefaults}
            colorScheme="blue"
            minW={"fit-content"}
            gap={"10px"}
          >
            Reset bars
            <RepeatIcon />
          </Button>
          <Button
            onClick={handleStopAlgorithm}
            colorScheme="orange"
            isDisabled={inProgress ? false : true}
          >
            Stop
          </Button>
        </Flex>
        <Box w="100vw" h="full">
          <Heading size="lg" my="1rem">
            Visualize{" "}
            <Text as="span" color={"red.600"}>
              {algorithm}
            </Text>
          </Heading>
          <Box w="100vw" h="75%">
            <Box ref={containerRef} h="full">
              <svg ref={ref} width="100%" height="100%" />
            </Box>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default Main;
