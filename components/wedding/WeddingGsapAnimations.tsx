"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "@/app/wedding/wedding.module.css";

gsap.registerPlugin(ScrollTrigger);

function classSelector(className: string) {
  return `.${className}`;
}

function classSelectors(classNames: string[]) {
  return classNames.map((className) => `.${className}`).join(", ");
}

export default function WeddingGsapAnimations() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const revealDistance = isMobile ? 12 : 22;

    const context = gsap.context(() => {
      function revealOnScroll({
        targets,
        trigger,
        y = revealDistance,
        duration = 0.62,
        stagger = 0.08,
        start = "top 88%",
      }: {
        targets: string;
        trigger?: string;
        y?: number;
        duration?: number;
        stagger?: number;
        start?: string;
      }) {
        const elements = gsap.utils.toArray<HTMLElement>(targets);

        if (!elements.length) {
          return;
        }

        const triggerElement =
          (trigger ? document.querySelector(trigger) : null) ||
          elements[0].closest("section") ||
          elements[0];

        gsap.fromTo(
          elements,
          {
            autoAlpha: 0,
            y,
            filter: "blur(4px)",
          },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration,
            stagger,
            ease: "power2.out",
            scrollTrigger: {
              trigger: triggerElement,
              start,
              once: true,
            },
          }
        );
      }

      function fadeOnScroll({
        targets,
        trigger,
        duration = 0.58,
        stagger = 0.08,
        start = "top 88%",
      }: {
        targets: string;
        trigger?: string;
        duration?: number;
        stagger?: number;
        start?: string;
      }) {
        const elements = gsap.utils.toArray<HTMLElement>(targets);

        if (!elements.length) {
          return;
        }

        const triggerElement =
          (trigger ? document.querySelector(trigger) : null) ||
          elements[0].closest("section") ||
          elements[0];

        gsap.fromTo(
          elements,
          {
            autoAlpha: 0,
            filter: "blur(4px)",
          },
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration,
            stagger,
            ease: "power2.out",
            scrollTrigger: {
              trigger: triggerElement,
              start,
              once: true,
            },
          }
        );
      }

      function scaleRevealOnScroll({
        targets,
        trigger,
        duration = 0.62,
        stagger = 0.07,
        start = "top 88%",
      }: {
        targets: string;
        trigger?: string;
        duration?: number;
        stagger?: number;
        start?: string;
      }) {
        const elements = gsap.utils.toArray<HTMLElement>(targets);

        if (!elements.length) {
          return;
        }

        const triggerElement =
          (trigger ? document.querySelector(trigger) : null) ||
          elements[0].closest("section") ||
          elements[0];

        gsap.fromTo(
          elements,
          {
            autoAlpha: 0,
            scale: 0.97,
            filter: "blur(4px)",
          },
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration,
            stagger,
            ease: "power2.out",
            scrollTrigger: {
              trigger: triggerElement,
              start,
              once: true,
            },
          }
        );
      }

      /*
        HERO
        Sound/music button animation is intentionally removed.
        Hero uses opacity/filter only to avoid breaking existing mobile transforms.
      */
      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power2.out",
        },
      });

      heroTimeline
        .fromTo(
          classSelector(styles.heroTop),
          {
            autoAlpha: 0,
            filter: "blur(4px)",
          },
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.5,
          }
        )
        .fromTo(
          classSelector(styles.heroMiddle),
          {
            autoAlpha: 0,
            filter: "blur(5px)",
          },
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.62,
          },
          "-=0.22"
        )
        .fromTo(
          classSelector(styles.heroBottom),
          {
            autoAlpha: 0,
            filter: "blur(4px)",
          },
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.56,
          },
          "-=0.2"
        )
        .fromTo(
          classSelectors([styles.floralLeft, styles.floralRight]),
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            duration: 0.62,
            stagger: 0.08,
          },
          "-=0.35"
        );

      /*
        COUNTDOWN
      */
      revealOnScroll({
        targets: classSelector(styles.countdownBorder),
        trigger: classSelector(styles.countdownSection),
        y: isMobile ? 12 : 20,
        duration: 0.62,
        start: "top 90%",
      });

      revealOnScroll({
        targets: classSelectors([
          styles.countdownSubtitle,
          styles.countdownHeading,
        ]),
        trigger: classSelector(styles.countdownSection),
        y: isMobile ? 8 : 14,
        duration: 0.55,
        stagger: 0.06,
        start: "top 90%",
      });

      scaleRevealOnScroll({
        targets: classSelector(styles.countdownBoxGroup),
        trigger: classSelector(styles.countdownSection),
        duration: 0.56,
        stagger: 0.05,
        start: "top 90%",
      });

      fadeOnScroll({
        targets: classSelector(styles.countdownLabel),
        trigger: classSelector(styles.countdownSection),
        duration: 0.48,
        stagger: 0.04,
        start: "top 90%",
      });

      /*
        DETAILS / EVENTS
        Event cards already have hover transforms in CSS, so this uses fade only.
      */
      revealOnScroll({
        targets: classSelectors([
          styles.eventsDate,
          styles.eventsTitle,
          styles.eventsDividerImg,
        ]),
        trigger: classSelector(styles.eventsSection),
        y: isMobile ? 10 : 18,
        duration: 0.58,
        stagger: 0.07,
        start: "top 90%",
      });

      fadeOnScroll({
        targets: classSelector(styles.eventCardImg),
        trigger: classSelector(styles.eventsSection),
        duration: 0.62,
        stagger: 0.08,
        start: "top 88%",
      });

      revealOnScroll({
        targets: classSelector(styles.saveOurDateWrapper),
        trigger: classSelector(styles.eventsSection),
        y: isMobile ? 10 : 16,
        duration: 0.58,
        start: "top 82%",
      });

      /*
        STORY
        Avoid animating storyCoupleImg directly because it already uses CSS transform.
      */
      revealOnScroll({
        targets: classSelectors([styles.storyTitle, styles.storyText]),
        trigger: classSelector(styles.storySection),
        y: isMobile ? 10 : 18,
        duration: 0.58,
        stagger: 0.08,
        start: "top 88%",
      });

      scaleRevealOnScroll({
        targets: classSelector(styles.storyFrameWrapper),
        trigger: classSelector(styles.storySection),
        duration: 0.62,
        start: "top 84%",
      });

      /*
        LOCATION
      */
      revealOnScroll({
        targets: classSelector(styles.locationTitleWrapper),
        trigger: classSelector(styles.locationSection),
        y: isMobile ? 10 : 16,
        duration: 0.55,
        start: "top 88%",
      });

      revealOnScroll({
        targets: classSelector(styles.venueCard),
        trigger: classSelector(styles.locationSection),
        y: isMobile ? 12 : 20,
        duration: 0.6,
        start: "top 84%",
      });

      revealOnScroll({
        targets: classSelector(styles.mapWrapper),
        trigger: classSelector(styles.locationSection),
        y: isMobile ? 12 : 20,
        duration: 0.6,
        start: "top 84%",
      });

      /*
        RSVP
      */
      revealOnScroll({
        targets: classSelector(styles.rsvpTitleWrapper),
        trigger: classSelector(styles.rsvpSection),
        y: isMobile ? 10 : 18,
        duration: 0.58,
        start: "top 88%",
      });

      scaleRevealOnScroll({
        targets: classSelector(styles.rsvpCard),
        trigger: classSelector(styles.rsvpSection),
        duration: 0.62,
        start: "top 84%",
      });

      /*
        FOOTER
      */
      revealOnScroll({
        targets: classSelectors([
          styles.footerTopDivider,
          styles.footerNames,
          styles.footerCallRow,
          styles.footerThankYou,
          styles.footerBottomDivider,
        ]),
        trigger: classSelector(styles.footerSection),
        y: isMobile ? 8 : 14,
        duration: 0.5,
        stagger: 0.06,
        start: "top 90%",
      });

      /*
        SAVE OUR DATE DROPDOWN
        This watches for the dropdown because it is conditionally rendered.
      */
      function animateCalendarDropdown() {
        const dropdown = document.getElementById("wedding-calendar-options");

        if (!dropdown || dropdown.dataset.gsapAnimated === "true") {
          return;
        }

        dropdown.dataset.gsapAnimated = "true";

        gsap.fromTo(
          dropdown,
          {
            autoAlpha: 0,
            y: -5,
            filter: "blur(3px)",
          },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.22,
            ease: "power2.out",
          }
        );

        gsap.fromTo(
          dropdown.querySelectorAll("a, button"),
          {
            autoAlpha: 0,
            x: -5,
          },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.2,
            stagger: 0.035,
            ease: "power2.out",
          }
        );
      }

      const dropdownObserver = new MutationObserver(() => {
        animateCalendarDropdown();
      });

      dropdownObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      /*
        RSVP SUCCESS MESSAGE
        This watches for success state after form submission.
      */
      function animateRsvpSuccess() {
        const successBox = document.querySelector<HTMLElement>(
          classSelector(styles.rsvpSuccessBox)
        );

        if (!successBox || successBox.dataset.gsapAnimated === "true") {
          return;
        }

        successBox.dataset.gsapAnimated = "true";

        gsap.fromTo(
          successBox,
          {
            autoAlpha: 0,
            scale: 0.98,
            filter: "blur(4px)",
          },
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.45,
            ease: "power2.out",
          }
        );
      }

      const rsvpObserver = new MutationObserver(() => {
        animateRsvpSuccess();
      });

      rsvpObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);

      return () => {
        dropdownObserver.disconnect();
        rsvpObserver.disconnect();
      };
    });

    return () => {
      context.revert();
    };
  }, []);

  return null;
}