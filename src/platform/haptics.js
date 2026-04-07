const IMPACT_STYLE_MAP = {
  light: "LIGHT",
  medium: "MEDIUM",
  heavy: "HEAVY",
};

export async function triggerImpact(style = "light") {
  try {
    const mappedStyle = IMPACT_STYLE_MAP[style] ?? IMPACT_STYLE_MAP.light;
    const haptics = globalThis.Capacitor?.Plugins?.Haptics;

    if (haptics?.impact) {
      await haptics.impact({ style: mappedStyle });
      return true;
    }

    if (globalThis.navigator?.vibrate) {
      const duration = style === "heavy" ? 22 : style === "medium" ? 16 : 10;
      globalThis.navigator.vibrate(duration);
      return true;
    }
  } catch {
    return false;
  }

  return false;
}
