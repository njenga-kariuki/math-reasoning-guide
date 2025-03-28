/**
 * In-memory database for development and testing
 */

// Simple in-memory storage
const problemsDb: any[] = [];
const annotationsDb: any[] = [];

// Generate a simple ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Problem methods
export const problemMethods = {
  find: async (filter = {}) => {
    return problemsDb.filter(item => {
      for (const [key, value] of Object.entries(filter)) {
        if (item[key] !== value) return false;
      }
      return true;
    });
  },
  
  findOne: async (filter = {}) => {
    return problemsDb.find(item => {
      for (const [key, value] of Object.entries(filter)) {
        if (item[key] !== value) return false;
      }
      return true;
    });
  },
  
  create: async (data: any) => {
    const newItem = { ...data, _id: generateId() };
    problemsDb.push(newItem);
    return newItem;
  },
  
  findOneAndUpdate: async (filter: any, update: any, options: any = {}) => {
    const index = problemsDb.findIndex(item => {
      for (const [key, value] of Object.entries(filter)) {
        if (item[key] !== value) return false;
      }
      return true;
    });
    
    if (index === -1) return null;
    
    problemsDb[index] = { ...problemsDb[index], ...update };
    
    if (options.new) {
      return problemsDb[index];
    }
    
    return problemsDb[index];
  },
  
  deleteMany: async () => {
    problemsDb.length = 0;
    return { acknowledged: true, deletedCount: 0 };
  },
  
  insertMany: async (items: any[]) => {
    const newItems = items.map(item => ({ ...item, _id: generateId() }));
    problemsDb.push(...newItems);
    return newItems;
  },
  
  countDocuments: async (filter = {}) => {
    return problemsDb.filter(item => {
      for (const [key, value] of Object.entries(filter)) {
        if (item[key] !== value) return false;
      }
      return true;
    }).length;
  }
};

// Annotation methods
export const annotationMethods = {
  find: async (filter = {}) => {
    return annotationsDb.filter(item => {
      for (const [key, value] of Object.entries(filter)) {
        if (item[key] !== value) return false;
      }
      return true;
    });
  },
  
  findById: async (id: string) => {
    return annotationsDb.find(item => item._id === id);
  },
  
  create: async (data: any) => {
    const newItem = { ...data, _id: generateId() };
    annotationsDb.push(newItem);
    return newItem;
  },
  
  findByIdAndUpdate: async (id: string, update: any) => {
    const index = annotationsDb.findIndex(item => item._id === id);
    
    if (index === -1) return null;
    
    annotationsDb[index] = { ...annotationsDb[index], ...update };
    return annotationsDb[index];
  }
};

// Mock mongoose models
export const Problem = {
  ...problemMethods,
  pre: () => {}
};

export const Annotation = {
  ...annotationMethods,
  pre: () => {}
};

// Mock connection function
export const connectDB = async () => {
  console.log('Connected to in-memory database');
  return true;
};

export default connectDB;
