import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MasterService } from '@/services/api/masters-service';

interface SubtopicContextType {
  data: any[] | undefined;
  isLoading: boolean;
  error: any;
  addRecord: (record: object) => Promise<void>;
  updateRecord: (id: number, updates: object) => Promise<void>;
  findRecordById: (id: number) => any;
  getAllSingleSubtopic: (subtopic: string) => Promise<any[] | undefined>;
  UseMergedDataQuery: (subtopic: string, from: string, to: string) => { data: any, isLoading: boolean, error: any };
  FetchLocationDetails: () => { data: any, isLoading: boolean, error: any };
  FetchMajorCategory:() => { data: any, isLoading: boolean, error: any };
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

  // Fetch location details using React Query
  const FetchLocationDetails = () => {
    return useQuery({
      queryKey: ['locationDetails'],
      queryFn: () => masterService.getLocationDetails(),
      staleTime: 5 * 60 * 1000, // Set stale time (5 minutes)
    });
  };
// Fetch location details using React Query
const FetchMajorCategory = () => {
    return useQuery({
      queryKey: ['majorCategoryDetails'],
      queryFn: () => masterService.getMajorCategoryDetails(),
      staleTime: 5 * 60 * 1000, // Set stale time (5 minutes)
    });
  };

  // Use React Query to fetch merged data
  const UseMergedDataQuery = (subtopic: string, from: string, to: string) => {
    return useQuery({
      queryKey: ['mergedData', subtopic, from, to],
      queryFn: () => masterService.getMergedDataOfSingleDoc(subtopic, from, to),
      staleTime: 5 * 60 * 1000, // Set stale time (5 minutes in this case)
    });
  };

  const addRecordMutation = useMutation({
    mutationFn: async (newRecord: object) => await masterService.addRecordToSubtopic(subtopic, newRecord),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtopics', subtopic] });
    },
  });

  const updateRecordMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: object }) =>
      await masterService.updateSubtopicDetails(subtopic, id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtopics', subtopic] });
    },
  });

  const addRecord = async (record: object) => {
    await addRecordMutation.mutateAsync(record);
  };

  const findRecordById = (id: number) => {
    if (!data) return undefined;
    return data.find((record: any) => record.id === id);
  };

  const updateRecord = async (id: number, updates: object) => {
    await updateRecordMutation.mutateAsync({ id, updates });
  };

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
        FetchMajorCategory
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
