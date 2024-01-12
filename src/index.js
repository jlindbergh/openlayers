function findAverageAtSite(site) {
  // Fetch data measurements from the server
  const measurements = fetchMeasurements();
  let samples = [];
  // Find all samples for the given site
  for (const measurement of measurements) {
    if (measurement.site === site) {
      samples = samples.concat(measurement.samples);
    }
  }
  // Compute the average of all samples and filter outliers
  let sum = 0;
  for (const sample of samples) {
    if (isOutlier(sample)) {
      continue;
    }
    sum += sample;
  }
  return sum / samples.length;
}

function propagationHandler (qi, options) {
  return function(query, queryOptions) {
    if (
      !options.stopPropagation &&
      !qi.options.stopPropagation &&
      qi.options.parent
    ) {
      return qi.options.parent.$query(options);
    }
  };
}

const Relationship = { LEFT: 1, RIGHT: 2, INTERSECTING: 4 };

function notSoGood(
  intersects,
  endRel,
  startRel,
  endX,
  endY,
  minX,
  minY,
  maxX,
  maxY,
  slope
) {
  if (
    !intersects &&
    !!(endRel & Relationship.RIGHT) &&
    !(startRel & Relationship.RIGHT)
  ) {
    // potentially intersects right
    y = endY - (endX - maxX) * slope;
    intersects = y >= minY && y <= maxY;
  }
}

function manyArgs (a, s, d, f, g, h) {
  console.log("I have many args");
}

const req = {
  "review": [{ "category": "Complex Conditional", "start_line": 2 }],
  "source_snippet": {
    "language": "JavaScript",
    "start_line": 0,
    "content": "function propagationHandler(qi, options) {\n  return function (query, queryOptions) {\n    if (\n      !options.stopPropagation &&\n      !qi.options.stopPropagation &&\n      qi.options.parent\n    ) {\n      return qi.options.parent.$query(options);\n    }\n  };\n}"
  }
};
const res = {
  "result": "low confidence",
  "reason": "Unexpected nodes added to the refactored code (whole tree). Cannot continue with certainty.",
  "diff-for-diagnostics": [{ "type": "Symbol", "symbol-name": "shouldPropagate" }],
  "code": "\nfunction propagationHandler(qi, options) {\n  return function (query, queryOptions) {\n    const shouldPropagate =\n      !options.stopPropagation &&\n      !qi.options.stopPropagation &&\n      qi.options.parent;\n\n    if (shouldPropagate) {\n      return qi.options.parent.$query(options);\n    }\n  };\n}\n",
  "success": false
};

// Refactored:
function propagationHandler2(qi, options) {
  return function (query, queryOptions) {
    const shouldPropagate =
      !options.stopPropagation &&
      !qi.options.stopPropagation &&
      qi.options.parent;

    if (shouldPropagate) {
      return qi.options.parent.$query(options);
    }
  };
}
