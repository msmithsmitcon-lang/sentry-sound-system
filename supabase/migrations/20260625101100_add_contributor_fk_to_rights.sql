ALTER TABLE public.rights_ownership_claims
ADD CONSTRAINT rights_ownership_claims_contributor_id_fkey
FOREIGN KEY (contributor_id)
REFERENCES public.contributors(id)
ON DELETE SET NULL;
