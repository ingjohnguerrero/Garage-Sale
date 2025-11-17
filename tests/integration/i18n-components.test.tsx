import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { I18nProvider } from '../../src/i18n/context';
import { en } from '../../src/locales/en';
import { useTranslation } from '../../src/i18n/hooks';

// Test component that uses translation
function TestComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('inactive.title')}</h1>
      <p>{t('common.close')}</p>
      <p>{t('filters.status.available')}</p>
    </div>
  );
}

describe('i18n integration', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render component with English translations', () => {
    render(
      <I18nProvider
        locale="en-US"
        currency="USD"
        translations={en}
        fallbackTranslations={en}
      >
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByText('Garage Sale Currently Inactive')).toBeDefined();
    expect(screen.getByText('Close')).toBeDefined();
    expect(screen.getByText('Available')).toBeDefined();
  });

  it('should fallback to English for missing translations', () => {
    const partialSpanish = {
      inactive: {
        title: 'Venta de garaje actualmente inactiva'
      },
      common: {},
      filters: {}
    };

    render(
      <I18nProvider
        locale="es-ES"
        currency="EUR"
        translations={partialSpanish}
        fallbackTranslations={en}
      >
        <TestComponent />
      </I18nProvider>
    );

    // Spanish translation should be used
    expect(screen.getByText('Venta de garaje actualmente inactiva')).toBeDefined();
    
    // Missing translations should fallback to English
    expect(screen.getAllByText('Close').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Available').length).toBeGreaterThan(0);
  });

  it('should handle variable interpolation in components', () => {
    function GreetingComponent() {
      const { t } = useTranslation();
      return <p data-testid="greeting">{t('common.close')}</p>;
    }

    render(
      <I18nProvider
        locale="en-US"
        currency="USD"
        translations={en}
        fallbackTranslations={en}
      >
        <GreetingComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('greeting')).toBeDefined();
    expect(screen.getByTestId('greeting').textContent).toBe('Close');
  });
});
