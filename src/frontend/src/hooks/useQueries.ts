import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Inquiry, ServiceType, UserProfile, SearchEvent, FeedbackEntry, BehaviorEvent } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Inquiry Submission (public)
export function useSubmitInquiry() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      serviceType: ServiceType;
      customerName: string;
      phoneNumber: string;
      email: string;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitInquiry(
        data.serviceType,
        data.customerName,
        data.phoneNumber,
        data.email,
        data.message
      );
    },
  });
}

// Inquiry Retrieval (authenticated only)
export function useGetAllInquiries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Inquiry[]>({
    queryKey: ['inquiries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInquiries();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetInquiriesByServiceType(serviceType: ServiceType | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Inquiry[]>({
    queryKey: ['inquiries', 'byServiceType', serviceType],
    queryFn: async () => {
      if (!actor || !serviceType) return [];
      return actor.getInquiriesByServiceType(serviceType);
    },
    enabled: !!actor && !actorFetching && !!serviceType,
  });
}

// Authorization Queries
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Search Analytics Mutation
export function useRecordSearchEvent() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (search: string) => {
      if (!actor) return;
      return actor.recordSearchEvent(search);
    },
    // Silent failure - don't show errors to user
    onError: () => {
      // Analytics logging failure should not disrupt UX
    },
  });
}

// Search Analytics Queries (admin only)
export function useGetRecentSearchEvents(limit: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SearchEvent[]>({
    queryKey: ['searchAnalytics', 'recent', limit.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentSearchEvents(limit);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTopSearchQueries(limit: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[string, bigint]>>({
    queryKey: ['searchAnalytics', 'top', limit.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopSearchQueries(limit);
    },
    enabled: !!actor && !actorFetching,
  });
}

// Feedback Submission (public)
export function useSubmitFeedback() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { rating: bigint | null; feedbackText: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitFeedback(data.rating, data.feedbackText);
    },
  });
}

// Feedback Retrieval (admin only)
export function useGetAllFeedback() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FeedbackEntry[]>({
    queryKey: ['feedback'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeedback();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetFeedbackById(id: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FeedbackEntry | null>({
    queryKey: ['feedback', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getFeedbackById(id);
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

// Behavior Tracking Mutation (public, non-blocking)
export function useRecordBehaviorEvent() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { eventType: string; details: string }) => {
      if (!actor) return;
      return actor.recordBehaviorEvent(data.eventType, data.details);
    },
    // Silent failure - don't show errors to user
    onError: () => {
      // Behavior tracking failure should not disrupt UX
    },
  });
}

// Behavior Analytics Queries (admin only)
export function useGetRecentBehaviorEvents(limit: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BehaviorEvent[]>({
    queryKey: ['behaviorAnalytics', 'recent', limit.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentBehaviorEvents(limit);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTopBehaviorEvents(limit: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[string, bigint]>>({
    queryKey: ['behaviorAnalytics', 'top', limit.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopBehaviorEvents(limit);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetBehaviorEventsByType(eventType: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BehaviorEvent[]>({
    queryKey: ['behaviorAnalytics', 'byType', eventType],
    queryFn: async () => {
      if (!actor || !eventType) return [];
      return actor.getBehaviorEventsByType(eventType);
    },
    enabled: !!actor && !actorFetching && !!eventType,
  });
}
