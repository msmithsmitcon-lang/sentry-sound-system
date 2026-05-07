insert into finance_country_currency (
  country_code,
  country_name,
  currency_code,
  currency_name,
  currency_symbol
)
values
('ZA', 'South Africa', 'ZAR', 'South African Rand', 'R'),
('US', 'United States', 'USD', 'US Dollar', '$'),
('GB', 'United Kingdom', 'GBP', 'British Pound', 'GBP'),
('EU', 'European Union', 'EUR', 'Euro', 'EUR')
on conflict (country_code) do update set
  country_name = excluded.country_name,
  currency_code = excluded.currency_code,
  currency_name = excluded.currency_name,
  currency_symbol = excluded.currency_symbol;
