"use client";

import React, { useState } from "react";

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const [added, setAdded] = useState<boolean>(!!isInWatchlist);

  const handleClick = () => {
    const next = !added;
    setAdded(next);
    onWatchlistChange?.(symbol, next);
  };

  if (type === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : "watchlist-icon"}`}
        title={company || symbol}
      >
        {/* Simple star indicator via text to keep it minimal */}
        {added ? "★" : "☆"}
      </button>
    );
  }

  return (
    <button type="button" onClick={handleClick} className="watchlist-btn">
      <span className="watchlist-star">{added ? "★" : "☆"}</span>
      <span>{added ? "Hapus dari Daftar Pantauan" : "Tambah ke Daftar Pantauan"}</span>
    </button>
  );
};

export default WatchlistButton;
