-- Add new record to the table `account`
INSERT INTO public.account
	(account_firstname, account_lastname, account_email, account_password)
	VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Update the record from the table `account`
UPDATE public.account SET account_type = 'Admin' WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Delete a record from the table `account`
DELETE FROM public.account WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Modifies a record in table `inventory`
UPDATE public.inventory
	SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
	WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Show all the `Sport` classification from table `inventory`
SELECT * FROM public.inventory
	JOIN public.classification AS c
	ON public.inventory.classification_id = c.classification_id
	WHERE c.classification_name = 'Sport';

-- Modifies the path of image and thumbnail from table `inventory`
UPDATE public.inventory
	SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicle/'),
		inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicle/');
