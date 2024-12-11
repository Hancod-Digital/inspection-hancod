import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MasterService } from '@/services/api/masters-service';
import { locationDataRange,  majorCategoryDataRange, minorCategoryDataRange, siteDataRange } from '@/lib/utils';

export interface DateRange {
  from: string;
  to: string;
}

interface SubtopicContextType { 
  data: any[] | undefined;
  isLoading: boolean;
  error: any;
  addRecord: (record: object,surveyor_competency?:any) => Promise<any[]>;
  updateRecord: (id: number, updates: object,surveyor_competency?:any) => Promise<void>;
  findRecordById: (id: number) => any;
  getAllSingleSubtopic: (subtopic: string) => Promise<any[] | undefined>;
  UseMergedDataQuery: (subtopic: string, from: string, to: string) => { data: any, isLoading: boolean, error: any };
  FetchLocationDetails: () => { data: any, isLoading: boolean, error: any };
  FetchMajorCategory:() => { data: any, isLoading: boolean, error: any };
  FetchMinorCategory:() => { data: any, isLoading: boolean, error: any };
  getMergedData: (dateRange: DateRange[], subtopic: string) => Promise<any>;
  findRecordByIdWithReference: (id: number, dataRange: DateRange[]) => Promise<any>
  deleteRecord: (id: number) => Promise<void>
  addProperty: (record: object) => Promise<void>;
  updateProperty: ({ id, updates }: { id: number; updates: object }) => Promise<void>;
  deleteProperty: ({ id }: { id: number }) => Promise<void>;
  properties: any[] | undefined;
  propertiesLoading: boolean;
  propertiesError: any;
}

const SubtopicContext = createContext<SubtopicContextType | undefined>(undefined);

interface SubtopicProviderProps {
  subtopic: string;
  children: React.ReactNode;
}

export const SubtopicProvider: React.FC<SubtopicProviderProps> = ({ subtopic, children }) => {
  const masterService = new MasterService();
  const queryClient = useQueryClient();
 

  const { data, isLoading, error } = useQuery({
    queryKey: ['subtopics', subtopic],
    queryFn: () => masterService.getAllSubtopicDetails(subtopic),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data:properties, isLoading:propertiesLoading, error:propertiesError } = useQuery({
    queryKey: ['properties'],
    queryFn: () => masterService.getAllProperties(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getAllSingleSubtopic = async (subtopic: string) => {
    let data = queryClient.getQueryData<any[]>(['subtopics', subtopic]);

    if (!data) {
      data = await queryClient.fetchQuery({
        queryKey: ['subtopics', subtopic],
        queryFn: () => masterService.getAllSubtopicDetails(subtopic),
      });
    }
    return data;
  };


  
  const getMergedData = async (
    dateRange: DateRange[],
    subtopic: string
  ) => {
    const queryKey = ['mergedData', JSON.stringify(dateRange), subtopic];
   
    // Check if the data is already in the cache
    let data = queryClient.getQueryData<any>(queryKey);
  
    if (!data) {
      // If not in cache, fetch the data
      data = await queryClient.fetchQuery({
        queryKey,
        queryFn: () => masterService.getMergedDataOfSingleDoc(subtopic,dateRange),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    } 
    
    return data;
  };

  // Fetch location details using React Query
  const FetchLocationDetails = () => {
    return useQuery({
      queryKey: ['locationDetails'],
      queryFn: () => masterService.getLocationDetails(),
      staleTime: 5 * 60 * 1000, 
    });
  };

  const FetchMajorCategory = () => {
    return useQuery({
      queryKey: ['majorCategoryDetails'],
      queryFn: () => masterService.getMajorCategoryDetails(),
      staleTime: 5 * 60 * 1000, 
    });
  };
 const FetchMinorCategory = () => {
    return useQuery({
        queryKey: ['minorCategoryDetails'],
        queryFn: () => masterService.getMinorCategoryDetails(),
        staleTime: 5 * 60 * 1000, 
      });
 }
  // Use React Query to fetch merged data
  const UseMergedDataQuery = (subtopic: string, from: string, to: string) => {
    return useQuery({
      queryKey: ['mergedData', subtopic, from, to],
      queryFn: () => masterService.getMergedDataOfSingleDoc(subtopic, [{from,to}]),
      staleTime: 5 * 60 * 1000, // Set stale time (5 minutes in this case)
    });
  };

  const addRecordMutation = useMutation({
    mutationFn: async ({ newRecord, surveyor_competency }: { newRecord: object; surveyor_competency?: any }) => {
      return await masterService.addRecordToSubtopic(subtopic, newRecord, surveyor_competency);
  },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mergedData', JSON.stringify(majorCategoryDataRange), subtopic] });
      queryClient.invalidateQueries({ queryKey: ['mergedData', JSON.stringify(siteDataRange), subtopic] });
      queryClient.invalidateQueries({ queryKey: ['mergedData', JSON.stringify(locationDataRange), subtopic] });
      queryClient.invalidateQueries({ queryKey: ['mergedData', JSON.stringify(minorCategoryDataRange), subtopic] });
      queryClient.invalidateQueries({ queryKey: ['locationDetails'] });
      queryClient.invalidateQueries({ queryKey: ['subtopics', subtopic] });
      queryClient.refetchQueries({ queryKey: ['mergedData', JSON.stringify(majorCategoryDataRange), subtopic] });
      queryClient.refetchQueries({ queryKey: ['mergedData', JSON.stringify(siteDataRange), subtopic] });
      queryClient.refetchQueries({ queryKey: ['mergedData', JSON.stringify(locationDataRange), subtopic] });
      queryClient.refetchQueries({ queryKey: ['mergedData', JSON.stringify(minorCategoryDataRange), subtopic] });
      queryClient.refetchQueries({ queryKey: ['locationDetails'] });
      queryClient.refetchQueries({ queryKey: ['subtopics', subtopic] });
    },
  });

  const updateRecordMutation = useMutation({
    mutationFn: async ({ id, updates,surveyor_competency }: { id: number; updates: object,surveyor_competency?:any }) =>
      await masterService.updateSubtopicDetails(subtopic, id, updates,surveyor_competency),
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ['mergedData', JSON.stringify(majorCategoryDataRange), subtopic] });
      queryClient.invalidateQueries({ queryKey: ['mergedData', JSON.stringify(siteDataRange), subtopic] });
      queryClient.invalidateQueries({ queryKey: ['mergedData', JSON.stringify(locationDataRange), subtopic] });
      queryClient.invalidateQueries({ queryKey: ['mergedData', JSON.stringify(minorCategoryDataRange), subtopic] });

      queryClient.invalidateQueries({ queryKey: ['subtopics', subtopic] });
      queryClient.refetchQueries({ queryKey: ['mergedData', JSON.stringify(majorCategoryDataRange), subtopic] });
      queryClient.refetchQueries({ queryKey: ['mergedData', JSON.stringify(siteDataRange), subtopic] });
      queryClient.refetchQueries({ queryKey: ['mergedData', JSON.stringify(locationDataRange), subtopic] });
      queryClient.refetchQueries({ queryKey: ['mergedData', JSON.stringify(minorCategoryDataRange), subtopic] });

      queryClient.refetchQueries({ queryKey: ['subtopics', subtopic] });
    },
  });
  const deleteRecordMutation = useMutation({
    mutationFn: async ({ id }: { id: number }) =>
      await masterService.deleteSubtopicDetails(subtopic, id),
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ['mergedData', JSON.stringify(majorCategoryDataRange), subtopic] });
      queryClient.invalidateQueries({ queryKey: ['mergedData', JSON.stringify(siteDataRange), subtopic] });
      queryClient.invalidateQueries({ queryKey: ['mergedData', JSON.stringify(locationDataRange), subtopic] });
      queryClient.invalidateQueries({ queryKey: ['mergedData', JSON.stringify(minorCategoryDataRange), subtopic] });

      queryClient.invalidateQueries({ queryKey: ['subtopics', subtopic] });
      queryClient.refetchQueries({ queryKey: ['mergedData', JSON.stringify(majorCategoryDataRange), subtopic] });
      queryClient.refetchQueries({ queryKey: ['mergedData', JSON.stringify(siteDataRange), subtopic] });
      queryClient.refetchQueries({ queryKey: ['mergedData', JSON.stringify(locationDataRange), subtopic] });
      queryClient.refetchQueries({ queryKey: ['mergedData', JSON.stringify(minorCategoryDataRange), subtopic] });

      queryClient.refetchQueries({ queryKey: ['subtopics', subtopic] });
    },
  });
  

  const addRecord = async (record: object,surveyor_competency?:any) => {
   
    return await addRecordMutation.mutateAsync({ newRecord: record, surveyor_competency });
    
  };
  
  const addPropertyMutation = useMutation({
    mutationFn: async (record: object) =>
      await masterService.addPropertyToAnnexure(record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.refetchQueries({ queryKey: ['properties'] });
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: object }) =>
      await masterService.updatePropertyToAnnexure(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.refetchQueries({ queryKey: ['properties'] });
    },
  });
 const deletePropertyMutation = useMutation({
    mutationFn: async ({ id }: { id: number }) =>
      await masterService.deletePropertyFromAnnexure(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.refetchQueries({ queryKey: ['properties'] });
    },
  }); 

  const addProperty = async (record: object) => {
    await addPropertyMutation.mutateAsync(record);
  }
  const updateProperty = async ({ id, updates }: { id: number; updates: object }) => {
    await updatePropertyMutation.mutateAsync({ id, updates });
  };
  const deleteProperty = async ({ id }: { id: number }) => {
    await deletePropertyMutation.mutateAsync({ id });
  };

  

  const findRecordByIdWithReference = async (id: number, dataRange:DateRange[] )=> {
    const data = await getMergedData(dataRange,subtopic)
    if (!data) return undefined;
    return data.find((record: any) => record.id === id);
  };

  const findRecordById = (id: number) => {
    
    if (!data) return undefined;
    
    return data.find((record: any) => record.id === id);
  };

  const updateRecord = async (id: number, updates: object, surveyor_competency?:any) => {
    await updateRecordMutation.mutateAsync({ id, updates, surveyor_competency });
  };
  const deleteRecord = async (id: number) => {
    await deleteRecordMutation.mutateAsync({id})
  }

  

  return (
    <SubtopicContext.Provider
      value={{
        data,
        isLoading,
        error,
        addRecord,
        updateRecord,
        findRecordById,
        getAllSingleSubtopic,
        UseMergedDataQuery,
        FetchLocationDetails,  // Added fetchLocationDetails to the context
        FetchMajorCategory,
        FetchMinorCategory,
        getMergedData,
        findRecordByIdWithReference,
        deleteRecord,
        addProperty,
        updateProperty,
        deleteProperty,
        properties,
        propertiesLoading,
        propertiesError
      }}
    >
      {children}
    </SubtopicContext.Provider>
  );
};

// Custom Hook to use the context
export const useSubtopic = () => {
  const context = useContext(SubtopicContext);
  if (context === undefined) {
    throw new Error('useSubtopic must be used within a SubtopicProvider');
  }
  return context;
};
