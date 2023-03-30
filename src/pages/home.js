import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.scss";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";

export default function Home() {
  const countdownTimerRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
  };

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router]);

  const [timeValues, setTimeValues] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    daysPercentage: 0,
    hoursPercentage: 0,
    minutesPercentage: 0,
    secondsPercentage: 0,
  });

  function createCircularProgressBar(percentage, unit, value) {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - percentage);

    return (
      <svg width="150" height="150" viewBox="0 -50 50 150">
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke="#eee"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke="#FD8A08"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90, 25, 25)`}
          fill="none"
        />
        <text
          x="25"
          y="15"
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize="22"
        >
          {value}
        </text>
        <text
          x="25"
          y="40"
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize="18"
        >
          {unit}
        </text>
      </svg>
    );
  }

  function updateCountdown() {
    const eventDate = new Date("2023-04-29 23:59:59"); // replace with your event date
    const currentDate = new Date();
    const difference = eventDate.getTime() - currentDate.getTime();
    const totalDays = Math.ceil(difference / (1000 * 60 * 60 * 24));

    if (difference <= 0) {
      clearInterval(interval);
      countdownTimer.innerHTML = "Event has started!";
      return;
    }

    let days = Math.floor(difference / (1000 * 60 * 60 * 24));
    let hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((difference / 1000 / 60) % 60);
    let seconds = Math.floor((difference / 1000) % 60);

    const daysPercentage = 1 - days / totalDays;
    const hoursPercentage = 1 - hours / 24;
    const minutesPercentage = 1 - minutes / 60;
    const secondsPercentage = 1 - seconds / 60;

    setTimeValues({
      days,
      hours,
      minutes,
      seconds,
      daysPercentage,
      hoursPercentage,
      minutesPercentage,
      secondsPercentage,
    });
  }

  function useInterval(callback, delay) {
    const savedCallback = useRef();
    const interval = useRef();

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);

    return interval;
  }

  function useCountdown() {
    const { interval } = useInterval(updateCountdown, 1000);
  }

  useCountdown();

  return (
    <motion.section
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
      transition={{ duration: 0.5 }}
      className={styles.heroContainer}
    >
      <div className={styles.textContainer}>
        <h1 className={styles.heading}>Brains & Brawn</h1>
        <h2 className={styles.subHeading}>
          Building Stronger Bonds and Boosting Productivity
        </h2>
        <h2 className={styles.subHeading2}>[Latest Event Name:]</h2>
        <div
          id="countdown-timer"
          ref={countdownTimerRef}
          className={styles.countdownTimer}
        >
          <div>
            {createCircularProgressBar(
              1 - timeValues.daysPercentage,
              "D",
              timeValues.days
            )}
          </div>
          <div className={styles.divider}>|</div>
          <div>
            {createCircularProgressBar(
              1 - timeValues.hoursPercentage,
              "H",
              timeValues.hours
            )}
          </div>
          <div className={styles.divider}>|</div>
          <div>
            {createCircularProgressBar(
              1 - timeValues.minutesPercentage,
              "M",
              timeValues.minutes
            )}
          </div>
          <div className={styles.divider}>|</div>
          <div>
            {createCircularProgressBar(
              1 - timeValues.secondsPercentage,
              "S",
              timeValues.seconds
            )}
          </div>
        </div>
        <div className={styles.ctaButton}>
          <Link href="/tickets/ticketPage" onClick={handleClick}>
            {isLoading ? (
              // Render the loading spinner component when isLoading is true
              <LoadingSpinner />
            ) : (
              "Buy Tickets"
            )}
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
