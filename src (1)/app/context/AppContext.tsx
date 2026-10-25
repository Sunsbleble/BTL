import { createContext, useContext, useState, ReactNode } from "react";
import type { Seat, FoodItem, Showtime, User } from "../data/mockData";

export interface BookingCart {
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  cinemaId: string;
  cinemaName: string;
  showtime: Showtime | null;
  auditoriumName: string;
  selectedSeats: Seat[];
  foodItems: { item: FoodItem; qty: number }[];
  voucher: string;
  voucherDiscount: number;
  pointsRedeemed: number;
}

interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  booking: BookingCart;
  currentView: string;
  previousView: string;
}

interface AppActions {
  login: (user: User) => void;
  logout: () => void;
  setBookingMovie: (data: Partial<BookingCart>) => void;
  setBookingSeats: (seats: Seat[]) => void;
  setBookingFood: (items: { item: FoodItem; qty: number }[]) => void;
  setVoucher: (code: string, discount: number) => void;
  setPointsRedeemed: (pts: number) => void;
  clearBooking: () => void;
  navigate: (view: string) => void;
  goBack: () => void;
}

const defaultBooking: BookingCart = {
  movieId: "",
  movieTitle: "",
  moviePoster: "",
  cinemaId: "",
  cinemaName: "",
  showtime: null,
  auditoriumName: "",
  selectedSeats: [],
  foodItems: [],
  voucher: "",
  voucherDiscount: 0,
  pointsRedeemed: 0,
};

const AppContext = createContext<(AppState & AppActions) | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [booking, setBooking] = useState<BookingCart>(defaultBooking);
  const [currentView, setCurrentView] = useState("home");
  const [previousView, setPreviousView] = useState("home");

  const login = (u: User) => {
    setUser(u);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView("home");
  };

  const setBookingMovie = (data: Partial<BookingCart>) => {
    setBooking((prev) => ({ ...prev, ...data }));
  };

  const setBookingSeats = (seats: Seat[]) => {
    setBooking((prev) => ({ ...prev, selectedSeats: seats }));
  };

  const setBookingFood = (items: { item: FoodItem; qty: number }[]) => {
    setBooking((prev) => ({ ...prev, foodItems: items }));
  };

  const setVoucher = (code: string, discount: number) => {
    setBooking((prev) => ({ ...prev, voucher: code, voucherDiscount: discount }));
  };

  const setPointsRedeemed = (pts: number) => {
    setBooking((prev) => ({ ...prev, pointsRedeemed: pts }));
  };

  const clearBooking = () => setBooking(defaultBooking);

  const navigate = (view: string) => {
    setPreviousView(currentView);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setCurrentView(previousView);
    setPreviousView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn,
        booking,
        currentView,
        previousView,
        login,
        logout,
        setBookingMovie,
        setBookingSeats,
        setBookingFood,
        setVoucher,
        setPointsRedeemed,
        clearBooking,
        navigate,
        goBack,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
