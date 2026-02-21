import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import api from "../api/axios";

const FeedbackContext = createContext(null);

export const FeedbackProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [flags, setFlags] = useState({
    driverFeedback: true,
    tripFeedback: true,
    appFeedback: true,
    marshalFeedback: false
  });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const socket = io("https://insightdrive.onrender.com", {
      withCredentials: true
    });

    socket.on("low-score-alert", (payload) => {
      setAlerts((prev) => [payload, ...prev].slice(0, 30));
      toast.error(`Low score alert: ${payload.driverName} (${payload.avgRating})`);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const flagsRes = await api.get("/flags");
        setFlags((prev) => ({ ...prev, ...flagsRes.data }));
      } catch (_error) {
      }

      try {
        const meRes = await api.get("/auth/me");
        setUser(meRes.data.user || null);
      } catch (_error) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    init();
  }, []);

  const value = useMemo(
    () => ({ user, setUser, authLoading, flags, setFlags, alerts, setAlerts }),
    [user, authLoading, flags, alerts]
  );

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>;
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used inside FeedbackProvider");
  }
  return context;
};
