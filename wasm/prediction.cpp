#include <cmath>
#include <cstddef>

extern "C" {

// Simple linear trend (slope) using index as x-axis.
float calculate_trend(const float* values, int n) {
  if (values == nullptr || n < 2) {
    return 0.0f;
  }

  double sumX = 0.0;
  double sumY = 0.0;
  double sumXY = 0.0;
  double sumX2 = 0.0;

  for (int i = 0; i < n; ++i) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }

  const double denom = (n * sumX2 - sumX * sumX);
  if (denom == 0.0) {
    return 0.0f;
  }

  const double slope = (n * sumXY - sumX * sumY) / denom;
  return static_cast<float>(slope);
}

// Population variance.
float calculate_variance(const float* values, int n) {
  if (values == nullptr || n == 0) {
    return 0.0f;
  }

  double sum = 0.0;
  for (int i = 0; i < n; ++i) {
    sum += values[i];
  }

  const double mean = sum / n;

  double sqDiff = 0.0;
  for (int i = 0; i < n; ++i) {
    const double diff = values[i] - mean;
    sqDiff += diff * diff;
  }

  return static_cast<float>(sqDiff / n);
}

}  // extern "C"

