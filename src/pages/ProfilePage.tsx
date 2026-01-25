import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Star,
  Calendar,
  TrendingUp,
  Save,
  Edit3,
  X,
  Loader,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { motion } from "framer-motion"
import type { ProfileForm, SocialLinks } from "../types/ProfileForm"
import toast from "react-hot-toast"
import { apiClient } from "../utils/apiClient"
import { getApiUrl } from "../config/api"

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    id: "",
    rating: 0,
    total_sales: 0,
    total_purchases: 0,
    experience_level: "beginner",
    avatar: "",
    bio: "",
    location: "",
    website: "",
    phone_number: "",
    social_links: { github: "", linkedin: "", twitter: "" },
    skills: [],
    status: "active",
    created_at: "",
  })

  const fetchUserProfile = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await apiClient(getApiUrl(`/users/profile/me`), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw new Error("Failed to fetch profile")
      const data = await res.json()
      if (data.profile) {
        const profile = data.profile
        const normalizedSocialLinks = Object.fromEntries(
          Object.entries(profile.social_links || {}).map(([k, v]) => [k, v ?? ""]),
        )
        setProfileForm({
          id: profile.id || "",
          rating: profile.rating ?? 0,
          total_sales: profile.total_sales ?? 0,
          total_purchases: profile.total_purchases ?? 0,
          experience_level: profile.experience_level || "beginner",
          avatar: profile.avatar || "",
          bio: profile.bio ?? "",
          location: profile.location ?? "",
          website: profile.website ?? "",
          phone_number: profile.phone_number ?? "",
          social_links: normalizedSocialLinks as any,
          skills: profile.skills || [],
          status: profile.status || "active",
          created_at: profile.created_at || "",
        })
      }
    } catch (err: any) {
      setError(err.message || "Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    setError("")
    try {
      const method = "PATCH"
      const url = getApiUrl(`/users/profile/${profileForm.id || user?.id}`)
      const payload = {
        rating: profileForm.rating,
        total_sales: profileForm.total_sales,
        total_purchases: profileForm.total_purchases,
        experience_level: profileForm.experience_level,
        avatar: avatarFile && avatarPreview ? avatarPreview : profileForm.avatar || "",
        bio: profileForm.bio ?? "",
        location: profileForm.location ?? "",
        website: profileForm.website ?? "",
        phone_number: profileForm.phone_number ?? "",
        social_links: Object.fromEntries(Object.entries(profileForm.social_links || {}).map(([k, v]) => [k, v ?? ""])),
        skills: profileForm.skills || [],
      }
      const res = await apiClient(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to save profile")
      const data = await res.json()
      setProfileForm({
        ...data.profile,
        phone_number: data.profile.phone_number || "",
        social_links: {
          github: data.profile.social_links?.github || "",
          linkedin: data.profile.social_links?.linkedin || "",
          twitter: data.profile.social_links?.twitter || "",
        },
        skills: data.profile.skills || [],
      })
      
      // Update user object in AuthContext and localStorage
      updateUser({
        avatar: data.profile.avatar || null,
        bio: data.profile.bio || null,
        location: data.profile.location || null,
        website: data.profile.website || null,
        social_links: data.profile.social_links || null,
        skills: data.profile.skills || [],
        experience_level: data.profile.experience_level || 'beginner',
        rating: data.profile.rating || 0,
        total_sales: data.profile.total_sales || 0,
        total_purchases: data.profile.total_purchases || 0
      })
      
      setAvatarFile(null)
      setAvatarPreview("")
      setIsEditingProfile(false)
      toast.success("Profile updated successfully!")
    } catch (err: any) {
      setError(err.message || "Failed to save profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    fetchUserProfile()
    setIsEditingProfile(false)
    setError("")
  }

  const handleInputChange = (field: keyof ProfileForm, value: any) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setProfileForm((prev) => ({
      ...prev,
      social_links: { ...prev.social_links, [platform]: value },
    }))
  }

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim()
    if (!trimmedSkill || profileForm.skills.includes(trimmedSkill)) return
    setProfileForm((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmedSkill],
    }))
    setNewSkill("")
  }

  const handleRemoveSkill = (index: number) => {
    setProfileForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const handleAvatarClear = () => {
    setAvatarFile(null)
    setAvatarPreview("")
  }

  useEffect(() => {
    if (!user) {
      navigate("/")
      return
    }
    fetchUserProfile()
  }, [user, navigate])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 sm:space-y-8"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 dark:text-gray-400">Loading profile...</span>
            </div>
          )}

          {/* Profile Completion Banner */}
          {!isLoading && (
            (() => {
              const incompleteFields = [];
              if (!profileForm.bio) incompleteFields.push('Bio');
              if (!profileForm.location) incompleteFields.push('Location');
              if (!profileForm.website) incompleteFields.push('Website');
              if (!profileForm.social_links.linkedin) incompleteFields.push('LinkedIn');
              if (!profileForm.social_links.github) incompleteFields.push('GitHub');
              if (!profileForm.social_links.twitter) incompleteFields.push('Twitter/X');
              if (profileForm.skills.length === 0) incompleteFields.push('Skills');

              const completionPercentage = Math.round(((7 - incompleteFields.length) / 7) * 100);

              // Only show if profile is incomplete
              if (incompleteFields.length === 0) return null;

              return (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 sm:p-5 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                      Complete Your Profile
                    </h3>
                    <span className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400">
                      {completionPercentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5 mb-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 sm:h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    A complete profile helps buyers trust your projects and increases your visibility on the platform.
                    <span className="font-semibold text-blue-600 dark:text-blue-400"> Your social links as a seller are only visible to logged-in users.</span>
                  </p>
                </div>
              );
            })()
          )}

          {/* Profile Header */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">Profile Settings</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 dark:text-gray-400">
                Manage your account information and preferences
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <div className="relative flex-shrink-0">
                <img
                  src={
                    avatarPreview ||
                    profileForm.avatar ||
                    "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
                  }
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-blue-100"
                />
                {isEditingProfile && (
                  <div className="mt-4 w-full">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Profile Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files && e.target.files[0]
                        if (!file) return
                        setAvatarFile(file)
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setAvatarPreview(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }}
                      className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100"
                    />
                    {(avatarPreview || profileForm.avatar) && (
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          type="button"
                          onClick={handleAvatarClear}
                          className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">{user?.full_name}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{user?.email}</p>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">
                      {profileForm.rating ? profileForm.rating.toFixed(1) : "0.0"}/5.0
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span className="font-semibold">{profileForm.total_sales} sales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    <span>
                      Joined{" "}
                      {profileForm.created_at
                        ? new Date(profileForm.created_at).toLocaleDateString()
                        : "Recently"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="mt-8 space-y-6 sm:space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      disabled={!isEditingProfile}
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={profileForm.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          disabled={!isEditingProfile}
                          placeholder="Your location"
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                        Phone Number <span className="text-gray-500 dark:text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone_number}
                        onChange={(e) => handleInputChange("phone_number", e.target.value)}
                        disabled={!isEditingProfile}
                        placeholder="Your phone number"
                        maxLength={20}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                      Experience Level
                    </label>
                    <select
                      value={profileForm.experience_level}
                      onChange={(e) => handleInputChange("experience_level", e.target.value)}
                      disabled={!isEditingProfile}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                      Account Status
                    </label>
                    <select
                      value={profileForm.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      disabled={!isEditingProfile}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">Skills</h3>
                <div className="space-y-3 sm:space-y-4">
                  {/* Skills Display */}
                  {profileForm.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {profileForm.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-medium"
                        >
                          {skill}
                          {isEditingProfile && (
                            <button
                              onClick={() => handleRemoveSkill(index)}
                              className="text-blue-500 hover:text-blue-700"
                              type="button"
                            >
                              <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Skills Input Field - Always visible like other fields */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      disabled={!isEditingProfile}
                      placeholder="Add skills (e.g., React, Python, UI/UX)"
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && isEditingProfile) {
                          e.preventDefault()
                          handleAddSkill()
                        }
                      }}
                    />
                    {isEditingProfile && (
                      <button
                        onClick={handleAddSkill}
                        disabled={!newSkill.trim()}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        type="button"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">Social Links</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* Website */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                    <input
                      type="url"
                      value={profileForm.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      disabled={!isEditingProfile}
                      placeholder="https://yourwebsite.com"
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  {/* GitHub */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Github className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                    <input
                      type="url"
                      value={profileForm.social_links.github}
                      onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                      disabled={!isEditingProfile}
                      placeholder="https://github.com/username"
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  {/* LinkedIn */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                    <input
                      type="url"
                      value={profileForm.social_links.linkedin}
                      onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                      disabled={!isEditingProfile}
                      placeholder="https://linkedin.com/in/username"
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  {/* Twitter */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
                    <input
                      type="url"
                      value={profileForm.social_links.twitter}
                      onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                      disabled={!isEditingProfile}
                      placeholder="https://twitter.com/username"
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons - At Bottom */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6 border-t border-gray-200 dark:border-gray-700">
                {isEditingProfile ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                      {isLoading ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200 text-sm sm:text-base"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    <Edit3 className="w-5 h-5" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">Account Statistics</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">
                  {profileForm.rating || 0}
                </div>
                <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 font-medium">Average Rating</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">
                  {profileForm.total_sales}
                </div>
                <div className="text-xs sm:text-sm text-green-700 dark:text-green-300 font-medium">Total Sales</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1 sm:mb-2">
                  {profileForm.total_purchases}
                </div>
                <div className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 font-medium">Total Purchases</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1 sm:mb-2">
                  {profileForm.skills.length}
                </div>
                <div className="text-xs sm:text-sm text-orange-700 dark:text-orange-300 font-medium">Skills</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
