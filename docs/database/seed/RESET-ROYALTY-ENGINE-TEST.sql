-- Reset Royalty Engine Test Run

delete from royalty_ledger
where royalty_distribution_id in (
  select id from royalty_distributions
  where royalty_event_id = '00000000-0000-0000-0000-000000000006'
);

delete from royalty_distributions
where royalty_event_id = '00000000-0000-0000-0000-000000000006';

update royalty_events
set status = 'draft'
where id = '00000000-0000-0000-0000-000000000006';
