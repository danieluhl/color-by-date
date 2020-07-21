// perform math for WCAG2 magic

// red, green, and blue coefficients
// https://en.wikipedia.org/wiki/Rec._709#Luma_coefficients
// https://en.wikipedia.org/wiki/Relative_luminance
const RGB_COEFFICIENTS = [0.2126, 0.7152, 0.0722];
const LOW_GAMMA_THRESHOLD = 0.03928;
// low-gamma adjust coefficient
const LOW_GAMMA_ADJUSTMENT_COEFFICIENT = 12.92;
// High gamma adjustment
// https://en.wikipedia.org/wiki/SRGB#The_reverse_transformation
const highGammaAdjust = val => Math.pow((val + 0.055) / 1.055, 2.4);

// Scale to the CIE colorspace
// https://en.wikipedia.org/wiki/CIE_1931_color_space
const getCIEColor = value => value / 255;
const gammaAdjust = value =>
  value <= LOW_GAMMA_THRESHOLD
    ? value / LOW_GAMMA_ADJUSTMENT_COEFFICIENT
    : highGammaAdjust(value);
const applyCoefficients = (value, i) => value * RGB_COEFFICIENTS[i];
const calculateLuminanceRatio = (value, i) =>
  applyCoefficients(gammaAdjust(getCIEColor(value)), i);

const getRelativeLuminance = rgb =>
  rgb.map(calculateLuminanceRatio).reduce((a, b) => a + b);

const getContrastRatio = (rgb1, rgb2) => {
  const rl1 = getRelativeLuminance(rgb1);
  const rl2 = getRelativeLuminance(rgb2);
  const l1 = Math.max(rl1, rl2);
  const l2 = Math.min(rl1, rl2);
  return (l1 + 0.05) / (l2 + 0.05);
};

const isAACompliant = ratio => ratio >= 4.5;
const isAAACompliant = ratio => ratio >= 7;

const checkCompliance = (rgb1, rgb2) => {
  const ratio = getContrastRatio(rgb1, rgb2);
  return {
    contrastRatio: ratio,
    isAACompliant: isAACompliant(ratio),
    isAAACompliant: isAAACompliant(ratio),
  };
}

export default checkCompliance;