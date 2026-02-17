import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EnquiryForm from '../EnquiryForm';
import { useAuth } from '../../contexts/AuthContext';
import * as enquiriesService from '../../services/enquiries.service';
import toast from 'react-hot-toast';

// Mock dependencies
vi.mock('../../contexts/AuthContext');
vi.mock('../../services/enquiries.service');
vi.mock('react-hot-toast');
vi.mock('../AuthModal', () => ({
  default: () => null, // Mock AuthModal to avoid rendering issues
}));

describe('EnquiryForm - Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should submit directly when authenticated user submits form', async () => {
    // Mock authenticated user
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
    } as any);

    // Mock successful API call
    const mockCreateEnquiry = vi.mocked(enquiriesService.createEnquiry).mockResolvedValue({
      id: '123',
      user_id: 'user-1',
      project_title: 'Test Project',
      project_description: 'Test description',
      budget_range: null,
      timeline: null,
      tech_preferences: [],
      additional_requirements: null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    vi.mocked(toast.success).mockImplementation(() => 'toast-id' as any);

    render(<EnquiryForm />);

    // Fill in required fields
    const titleInput = screen.getByPlaceholderText(/e-commerce website/i);
    const descInput = screen.getByPlaceholderText(/describe your project/i);

    fireEvent.change(titleInput, { target: { value: 'Test Project' } });
    fireEvent.change(descInput, { target: { value: 'This is a test project description' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit enquiry/i });
    fireEvent.click(submitButton);

    // Should call API directly
    await waitFor(() => {
      expect(mockCreateEnquiry).toHaveBeenCalledWith({
        project_title: 'Test Project',
        project_description: 'This is a test project description',
        budget_range: undefined,
        timeline: undefined,
        tech_preferences: undefined,
        additional_requirements: undefined,
      });
    });

    // Should show success toast
    expect(toast.success).toHaveBeenCalledWith(
      expect.stringContaining('Enquiry submitted successfully')
    );
  });

  it('should show loading state during submission', async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
    } as any);

    // Mock slow API call
    vi.mocked(enquiriesService.createEnquiry).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<EnquiryForm />);

    // Fill in form
    const titleInput = screen.getByPlaceholderText(/e-commerce website/i);
    const descInput = screen.getByPlaceholderText(/describe your project/i);

    fireEvent.change(titleInput, { target: { value: 'Test Project' } });
    fireEvent.change(descInput, { target: { value: 'Test description for loading state' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit enquiry/i });
    fireEvent.click(submitButton);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText(/submitting/i)).toBeTruthy();
    });

    // Button should be disabled
    expect(submitButton.hasAttribute('disabled')).toBe(true);
  });

  it('should show error toast on submission failure', async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
    } as any);

    // Mock API error
    const errorMessage = 'Network error';
    vi.mocked(enquiriesService.createEnquiry).mockRejectedValue(
      new Error(errorMessage)
    );

    vi.mocked(toast.error).mockImplementation(() => 'toast-id' as any);

    render(<EnquiryForm />);

    // Fill in form
    const titleInput = screen.getByPlaceholderText(/e-commerce website/i);
    const descInput = screen.getByPlaceholderText(/describe your project/i);

    fireEvent.change(titleInput, { target: { value: 'Test Project' } });
    fireEvent.change(descInput, { target: { value: 'Test description' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit enquiry/i });
    fireEvent.click(submitButton);

    // Should show error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
