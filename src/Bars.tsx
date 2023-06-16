import { Box, Container } from "@chakra-ui/react";
import React, { useRef, useEffect } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import { useState } from "react";
import { Selection, select } from "d3-selection";

type Props = {
    sliderValue: number
};

const Bars:React.FC<Props> = ({sliderValue}) => {
//   const [sliderValue, setSliderValue] = useState(100);
  const [sorted, setSorted] = useState<boolean[]>(
    new Array(sliderValue).fill(false)
  );
  const [selected, setSelected] = useState<string | null>(null);

  const initialData = Array.from({ length: sliderValue }, () =>
    Math.floor(Math.random() * 2000 + 20)
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
        .attr("y", (d) => y(d))
        .attr("fill", (_, i) => (sorted[i] ? "green" : "#5d006f"));

      rects
        .enter()
        .append("rect")
        .attr("width", x.bandwidth)
        .attr("height", (d) => dimensions.height - y(d))
        .attr("x", (_, i) => x(i.toString())!)
        .attr("y", (d) => y(d))
        .attr("fill", (_, i) => (sorted[i] ? "green" : "#5d006f"));
    }
  }, [selection, data]);

  useEffect(()=> {
    setData(Array.from({ length: sliderValue }, () => Math.floor(Math.random() * 2000 + 20)));
    setSorted(new Array(sliderValue).fill(false));
    setSelected(null)
  }, [sliderValue])

  return (
    <Box w="100vw" h="80%">
      <Box ref={containerRef} h="full">
        <svg ref={ref} width="100%" height="100%" />
      </Box>
    </Box>
  );
};

export default Bars;
