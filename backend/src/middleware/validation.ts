import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      res.status(400).json({ message: 'Erreur de validation', errors });
      return;
    }

    next();
  };
};

// Schémas de validation des utilisateurs
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Veuillez fournir une adresse email valide',
    'any.required': 'L\'email est requis',
  }),
  pseudo: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Le pseudo doit faire au moins 2 caractères',
    'string.max': 'Le pseudo ne doit pas dépasser 50 caractères',
    'any.required': 'Le pseudo est requis',
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.min': 'Le mot de passe doit faire au moins 6 caractères',
    'string.max': 'Le mot de passe ne doit pas dépasser 128 caractères',
    'any.required': 'Le mot de passe est requis',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Veuillez fournir une adresse email valide',
    'any.required': 'L\'email est requis', 
  }),
  password: Joi.string().required().messages({
    'any.required': 'Le mot de passe est requis',
  }),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Veuillez fournir une adresse email valide',
  }),
  pseudo: Joi.string().min(2).max(50).messages({
    'string.min': 'Le pseudo doit faire au moins 2 caractères',
    'string.max': 'Le pseudo ne doit pas dépasser 50 caractères',
  }),
  password: Joi.string().min(6).max(128).messages({
    'string.min': 'Le mot de passe doit faire au moins 6 caractères',
    'string.max': 'Le mot de passe ne doit pas dépasser 128 caractères',
  }),
  role: Joi.string().valid('user', 'employee', 'admin').messages({
    'any.only': 'Le rôle doit être utilisateur, employé ou administrateur',
  }),
}).min(1).messages({
  'object.min': 'Au moins un champ doit être fourni pour la mise à jour',
});

// Schémas de validation des hôtels
export const createHotelSchema = Joi.object({
  name: Joi.string().min(2).max(200).required().messages({
    'string.min': 'Le nom de l\'hôtel doit faire au moins 2 caractères',
    'string.max': 'Le nom de l\'hôtel ne doit pas dépasser 200 caractères',
    'any.required': 'Le nom de l\'hôtel est requis',
  }),
  location: Joi.string().min(2).max(500).required().messages({
    'string.min': 'La localisation doit faire au moins 2 caractères',
    'string.max': 'La localisation ne doit pas dépasser 500 caractères',
    'any.required': 'La localisation est requise',
  }),
  description: Joi.string().min(10).max(5000).required().messages({
    'string.min': 'La description doit faire au moins 10 caractères',
    'string.max': 'La description ne doit pas dépasser 5000 caractères',
    'any.required': 'La description est requise',
  }),
  picture_list: Joi.array().items(Joi.string().uri()).default([]).messages({
    'string.uri': 'Chaque image doit être une URL valide',
  }),
});

export const updateHotelSchema = Joi.object({
  name: Joi.string().min(2).max(200).messages({
    'string.min': 'Le nom de l\'hôtel doit faire au moins 2 caractères',
    'string.max': 'Le nom de l\'hôtel ne doit pas dépasser 200 caractères',
  }),
  location: Joi.string().min(2).max(500).messages({
    'string.min': 'La localisation doit faire au moins 2 caractères',
    'string.max': 'La localisation ne doit pas dépasser 500 caractères',
  }),
  description: Joi.string().min(10).max(5000).messages({
    'string.min': 'La description doit faire au moins 10 caractères',
    'string.max': 'La description ne doit pas dépasser 5000 caractères',
  }),
  picture_list: Joi.array().items(Joi.string().uri()).messages({
    'string.uri': 'Chaque image doit être une URL valide',
  }),
}).min(1).messages({
  'object.min': 'Au moins un champ doit être fourni pour la mise à jour',
});

// Schémas de validation des réservations
export const createBookingSchema = Joi.object({
  hotelId: Joi.alternatives().try(Joi.string(), Joi.number().integer().positive()).required().messages({
    'number.base': 'Format d\'ID d\'hôtel invalide',
    'any.required': 'L\'ID d\'hôtel est requis',
  }),
  checkIn: Joi.date().iso().min('now').required().messages({
    'date.min': 'La date d\'arrivée doit être dans le futur',
    'any.required': 'La date d\'arrivée est requise',
  }),
  checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).required().messages({
    'date.greater': 'La date de départ doit être après la date d\'arrivée',
    'any.required': 'La date de départ est requise',
  }),
  guests: Joi.number().integer().min(1).max(20).required().messages({
    'number.min': 'Au moins 1 voyageur est requis',
    'number.max': 'Maximum 20 voyageurs autorisés',
    'any.required': 'Le nombre de voyageurs est requis',
  }),
});

export const updateBookingSchema = Joi.object({
  checkIn: Joi.date().iso().messages({
    'date.base': 'L\'arrivée doit être une date valide',
  }),
  checkOut: Joi.date().iso().messages({
    'date.base': 'Le départ doit être une date valide',
  }),
  guests: Joi.number().integer().min(1).max(20).messages({
    'number.min': 'Au moins 1 voyageur est requis',
    'number.max': 'Maximum 20 voyageurs autorisés',
  }),
  status: Joi.string().valid('confirmed', 'cancelled', 'pending').messages({
    'any.only': 'L\'état doit être confirmé, annulé ou en attente',
  }),
}).min(1).messages({
  'object.min': 'Au moins un champ doit être fourni pour la mise à jour',
});
