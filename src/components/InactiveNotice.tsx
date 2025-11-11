import { SALE_START, SALE_END } from "../constants";

export function InactiveNotice() {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  });

  return (
    <div className="inactive-notice" role="alert">
      <h1>Garage Sale Currently Inactive</h1>
      <p>
        Thank you for visiting! Our garage sale is not currently active.
      </p>
      <div className="sale-dates">
        <p>
          <strong>Sale Start:</strong> {dateFormatter.format(SALE_START)}
        </p>
        <p>
          <strong>Sale End:</strong> {dateFormatter.format(SALE_END)}
        </p>
      </div>
      <p>
        Please check back during the sale window to view available items!
      </p>
    </div>
  );
}
