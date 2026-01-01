#include <algorithm>

extern "C" {

// Mirrors FeedingOptimizer.calculateEnvironmentScore.
float calculate_environment_score(
    float dissolved_oxygen_mgl,
    float ph,
    float turbidity_ntu,
    float ammonia_mgl,
    float temperature_c,
    float fish_activity_index,
    // thresholds: [do_min, do_crit_min, ph_min, ph_max, ph_crit_min, ph_crit_max,
    // turb_max, turb_crit_max, ammo_max, ammo_crit_max, temp_min, temp_max, activity_min]
    const float* thresholds,
    int thresholds_len) {

  if (thresholds == nullptr || thresholds_len < 13) {
    return 0.0f;
  }

  float score = 1.0f;

  const float do_min = thresholds[0];
  const float do_crit_min = thresholds[1];
  const float ph_min = thresholds[2];
  const float ph_max = thresholds[3];
  const float ph_crit_min = thresholds[4];
  const float ph_crit_max = thresholds[5];
  const float turb_max = thresholds[6];
  const float turb_crit_max = thresholds[7];
  const float ammo_max = thresholds[8];
  const float ammo_crit_max = thresholds[9];
  const float temp_min = thresholds[10];
  const float temp_max = thresholds[11];
  const float activity_min = thresholds[12];

  if (dissolved_oxygen_mgl < do_crit_min) {
    score -= 0.40f;
  } else if (dissolved_oxygen_mgl < do_min) {
    score -= 0.25f;
  }

  if (ph < ph_crit_min || ph > ph_crit_max) {
    score -= 0.25f;
  } else if (ph < ph_min || ph > ph_max) {
    score -= 0.15f;
  }

  if (turbidity_ntu > turb_crit_max) {
    score -= 0.20f;
  } else if (turbidity_ntu > turb_max) {
    score -= 0.15f;
  }

  if (ammonia_mgl > ammo_crit_max) {
    score -= 0.30f;
  } else if (ammonia_mgl > ammo_max) {
    score -= 0.20f;
  }

  if (temperature_c < temp_min || temperature_c > temp_max) {
    score -= 0.10f;
  }

  if (fish_activity_index < activity_min) {
    score -= 0.15f;
  }

  return std::clamp(score, 0.0f, 1.0f);
}

// Mirrors FeedingOptimizer.calculateFeedingAdjustment.
float calculate_feeding_adjustment(
    float dissolved_oxygen_mgl,
    float turbidity_ntu,
    float ammonia_mgl,
    float fish_activity_index,
    float temperature_c,
    float envScore) {

  float adjustment = 0.0f;

  if (envScore < 0.5f) {
    adjustment -= 30.0f;
  } else if (envScore < 0.7f) {
    adjustment -= 15.0f;
  } else if (envScore > 0.9f) {
    adjustment += 5.0f;
  }

  if (dissolved_oxygen_mgl < 5.5f) {
    adjustment -= 20.0f;
  } else if (dissolved_oxygen_mgl < 6.0f) {
    adjustment -= 10.0f;
  }

  if (turbidity_ntu > 30.0f) {
    adjustment -= 15.0f;
  } else if (turbidity_ntu > 25.0f) {
    adjustment -= 8.0f;
  }

  if (ammonia_mgl > 0.4f) {
    adjustment -= 20.0f;
  } else if (ammonia_mgl > 0.25f) {
    adjustment -= 10.0f;
  }

  if (fish_activity_index < 0.6f) {
    adjustment -= 12.0f;
  } else if (fish_activity_index > 0.85f) {
    adjustment += 5.0f;
  }

  if (temperature_c < 24.0f || temperature_c > 31.0f) {
    adjustment -= 10.0f;
  }

  if (adjustment < -40.0f) adjustment = -40.0f;
  if (adjustment > 15.0f) adjustment = 15.0f;

  return adjustment;
}

}  // extern "C"

