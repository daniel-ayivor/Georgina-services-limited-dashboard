-- Drop existing foreign key constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'products_created_by_fkey'
    ) THEN
        ALTER TABLE public.products DROP CONSTRAINT products_created_by_fkey;
    END IF;
END $$;

-- Add foreign key constraint to products table
ALTER TABLE public.products
ADD CONSTRAINT products_created_by_fkey
FOREIGN KEY (created_by)
REFERENCES public.users(id)
ON DELETE SET NULL; 