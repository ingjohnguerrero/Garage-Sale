import { SALE_START, SALE_END } from "../constants";
import { useTranslation, useFormatters } from "../i18n";

export function InactiveNotice() {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  };

  return (
    <div className="inactive-notice" role="alert">
      <h1>{t('inactive.title')}</h1>
      <p>{t('inactive.message')}</p>
      <div className="sale-dates">
        <p>
          <strong>{t('inactive.saleStarts')}:</strong> {formatDate(SALE_START, dateOptions)}
        </p>
        <p>
          <strong>{t('inactive.saleEnds')}:</strong> {formatDate(SALE_END, dateOptions)}
        </p>
      </div>
      <p>{t('inactive.checkBack')}</p>
    </div>
  );
}
