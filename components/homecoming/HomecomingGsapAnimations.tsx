"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "@/app/homecoming/homecoming.module.css";

gsap.registerPlugin(ScrollTrigger);

function classSelector(className: string) {
  return `.${className}`;
}

function getElements(className: string) {
  return gsap.utils.toArray<HTMLElement>(classSelector(className));
}

function getFirstElement(className: string) {
  return document.querySelector<HTMLElement>(classSelector(className));
}

function addTimelineAnimation(
  timeline: gsap.core.Timeline,
  className: string,
  animation: gsap.TweenVars,
  position?: string
) {
  const targets = getElements(className);

  if (targets.length === 0) {
    return;
  }

  timeline.from(targets, animation, position);
}

function addScrollAnimation(
  targetClassNames: string[],
  triggerClassName: string,
  animation: gsap.TweenVars,
  start = "top 78%"
) {
  const trigger = getFirstElement(triggerClassName);

  if (!trigger) {
    return;
  }

  const targets = targetClassNames.flatMap((className) => getElements(className));

  if (targets.length === 0) {
    return;
  }

  gsap.from(targets, {
    ...animation,
    scrollTrigger: {
      trigger,
      start,
      toggleActions: "play none none reverse",
    },
  });
}

export default function HomecomingGsapAnimations() {
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const context = gsap.context(() => {
      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      addTimelineAnimation(heroTimeline, styles.heroTopText, {
        autoAlpha: 0,
        y: -14,
        duration: 0.42,
      });

      addTimelineAnimation(
        heroTimeline,
        styles.heroFlowerTopLeft,
        {
          autoAlpha: 0,
          x: -26,
          y: -18,
          duration: 0.7,
        },
        "-=0.12"
      );

      addTimelineAnimation(
        heroTimeline,
        styles.heroFlowerBottomRight,
        {
          autoAlpha: 0,
          x: 26,
          y: 18,
          duration: 0.7,
        },
        "<"
      );

      addTimelineAnimation(
        heroTimeline,
        styles.heroRingWrap,
        {
          autoAlpha: 0,
          scale: 0.94,
          duration: 0.68,
        },
        "-=0.42"
      );

      addTimelineAnimation(
        heroTimeline,
        styles.heroInviteText,
        {
          autoAlpha: 0,
          y: 14,
          duration: 0.42,
        },
        "-=0.18"
      );

      addTimelineAnimation(
        heroTimeline,
        styles.heroMonth,
        {
          autoAlpha: 0,
          y: 12,
          duration: 0.36,
        },
        "-=0.12"
      );

      addTimelineAnimation(
        heroTimeline,
        styles.heroDateGrid,
        {
          autoAlpha: 0,
          y: 14,
          duration: 0.42,
        },
        "-=0.08"
      );

      addTimelineAnimation(
        heroTimeline,
        styles.heroYear,
        {
          autoAlpha: 0,
          y: 10,
          duration: 0.34,
        },
        "-=0.12"
      );

      addTimelineAnimation(
        heroTimeline,
        styles.heroVenue,
        {
          autoAlpha: 0,
          y: 10,
          duration: 0.34,
        },
        "-=0.12"
      );

      addScrollAnimation(
        [
          styles.countdownDivider,
          styles.countdownSmallText,
          styles.countdownGrid,
          styles.countdownDividerBottom,
        ],
        styles.countdownSection,
        {
          autoAlpha: 0,
          y: 26,
          duration: 0.72,
          stagger: 0.09,
          ease: "power3.out",
        }
      );

      addScrollAnimation(
        [styles.countdownBox],
        styles.countdownSection,
        {
          autoAlpha: 0,
          y: 18,
          scale: 0.94,
          duration: 0.62,
          stagger: 0.08,
          ease: "back.out(1.35)",
        },
        "top 72%"
      );

      addScrollAnimation(
        [styles.detailsTitle],
        styles.detailsSection,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.58,
          ease: "power3.out",
        }
      );

      addScrollAnimation(
        [styles.detailsArch, styles.detailsIconCircle, styles.detailsText],
        styles.detailsSection,
        {
          autoAlpha: 0,
          y: 28,
          duration: 0.72,
          stagger: 0.08,
          ease: "power3.out",
        },
        "top 70%"
      );

      addScrollAnimation(
        [styles.detailsConnector],
        styles.detailsSection,
        {
          autoAlpha: 0,
          scaleX: 0,
          transformOrigin: "center center",
          duration: 0.72,
          ease: "power3.out",
        },
        "top 68%"
      );

      addScrollAnimation(
        [styles.storyTitle, styles.storyText],
        styles.storySection,
        {
          autoAlpha: 0,
          y: 24,
          duration: 0.68,
          stagger: 0.1,
          ease: "power3.out",
        }
      );

      addScrollAnimation(
        [styles.storyImage],
        styles.storySection,
        {
          autoAlpha: 0,
          scale: 0.96,
          duration: 0.78,
          ease: "power3.out",
        },
        "top 70%"
      );

      addScrollAnimation(
        [styles.locationEyebrow, styles.locationAddress],
        styles.locationCalendarSection,
        {
          autoAlpha: 0,
          y: 22,
          duration: 0.64,
          stagger: 0.1,
          ease: "power3.out",
        }
      );

      addScrollAnimation(
        [styles.mapCard, styles.calendarCard],
        styles.locationCalendarSection,
        {
          autoAlpha: 0,
          y: 30,
          duration: 0.72,
          stagger: 0.12,
          ease: "power3.out",
        },
        "top 70%"
      );

      addScrollAnimation(
        [styles.rsvpIntro, styles.rsvpFormCard],
        styles.rsvpSection,
        {
          autoAlpha: 0,
          y: 30,
          duration: 0.72,
          stagger: 0.12,
          ease: "power3.out",
        }
      );

      addScrollAnimation(
        [styles.footerLeft, styles.footerDivider, styles.footerRight],
        styles.footerSection,
        {
          autoAlpha: 0,
          y: 24,
          duration: 0.68,
          stagger: 0.1,
          ease: "power3.out",
        }
      );

      ScrollTrigger.refresh();
    });

    return () => {
      context.revert();
    };
  }, []);

  return null;
}