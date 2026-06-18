"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GraduationCap, Sprout, Trees, TreePine, Warehouse } from "lucide-react";
import type { ImpactStat } from "@/lib/public-api";

export function AnimatedImpactStatCard({ stat }: { stat: ImpactStat }) {
  const ref = useRef<HTMLElement | null>(null);
  const hasAnimatedRef = useRef(false);
  const parsed = useMemo(() => parseNumericValue(stat.value), [stat.value]);
  const [displayValue, setDisplayValue] = useState(parsed ? "0" : stat.value);
  const Icon = getImpactIcon(stat.label);

  useEffect(() => {
    if (!parsed) {
      setDisplayValue(stat.value);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplayValue(formatNumber(parsed.value, parsed.decimals));
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    let animationFrame = 0;
    let startTime = 0;
    const duration = getAnimationDuration(parsed.value);

    const runAnimation = () => {
      if (hasAnimatedRef.current) {
        return;
      }

      hasAnimatedRef.current = true;
      const step = (timestamp: number) => {
        if (!startTime) {
          startTime = timestamp;
        }

        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = parsed.value * eased;
        setDisplayValue(formatNumber(current, parsed.decimals));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        }
      };

      animationFrame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        observer.disconnect();
        runAnimation();
      },
      { threshold: 0.35 }
    );

    observer.observe(element);
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      observer.disconnect();
      runAnimation();
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [parsed, stat.value]);

  return (
    <article className="stat-card reveal-card" ref={ref}>
      <span className="card-icon" aria-hidden="true">
        <Icon size={20} />
      </span>
      <p className="stat-value">
        {displayValue}
        {stat.suffix}
      </p>
      <h3>{stat.label}</h3>
      {stat.description ? <p>{stat.description}</p> : null}
    </article>
  );
}

function getAnimationDuration(value: number) {
  if (value > 100000) {
    return 3900;
  }

  if (value > 1000) {
    return 3300;
  }

  return 2800;
}

function getImpactIcon(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("farmer") || normalized.includes("trained")) {
    return GraduationCap;
  }

  if (normalized.includes("tree") || normalized.includes("planted")) {
    return Trees;
  }

  if (normalized.includes("hectare") || normalized.includes("restored")) {
    return TreePine;
  }

  if (normalized.includes("nursery")) {
    return Warehouse;
  }

  return Sprout;
}

function parseNumericValue(value: string) {
  const normalized = value.replace(/,/g, "").trim();
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }

  const decimals = normalized.includes(".") ? normalized.split(".")[1].length : 0;
  return {
    value: Number(normalized),
    decimals
  };
}

function formatNumber(value: number, decimals: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(value);
}
