"use client"

import type React from "react"

import { useState } from "react"
import { Send, User, Mail, MessageSquare, Briefcase, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ContactFormProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Create FormData object for Formspree
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("company", formData.company || "Not specified")
      formDataToSend.append("project_type", formData.projectType || "Not specified")
      formDataToSend.append("budget", formData.budget || "Not specified")
      formDataToSend.append("timeline", formData.timeline || "Not specified")
      formDataToSend.append("message", formData.message)

      // Add a subject line for better email organization
      formDataToSend.append("_subject", `New Project Inquiry from ${formData.name}`)

      // Send to Formspree
      const response = await fetch("https://formspree.io/f/mqaborrl", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        setSubmitStatus("success")
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            company: "",
            projectType: "",
            budget: "",
            timeline: "",
            message: "",
          })
          onClose()
          setSubmitStatus("idle")
        }, 3000)
      } else {
        const errorData = await response.json()
        console.error("Formspree error:", errorData)
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.name && formData.email && formData.message

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-5 w-5 text-primary" />
            Get in Touch
          </DialogTitle>
          <DialogDescription>
            Ready to start your project? Fill out the form below and I'll get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>

        {submitStatus === "success" && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <strong>Message sent successfully!</strong> Thank you for reaching out. I'll get back to you within 24
              hours with a detailed response about your project.
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Oops! Something went wrong.</strong> Please try again, or feel free to email me directly at{" "}
              <a href="mailto:deepindersingh042007@gmail.com" className="underline font-medium">
                deepindersingh042007@gmail.com
              </a>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@company.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Company/Organization
            </Label>
            <Input
              id="company"
              name="company"
              placeholder="Your company name (optional)"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <Select value={formData.projectType} onValueChange={(value) => handleInputChange("projectType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web-development">Web Development</SelectItem>
                  <SelectItem value="mobile-app">Mobile App Development</SelectItem>
                  <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                  <SelectItem value="content-writing">Content Writing</SelectItem>
                  <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                  <SelectItem value="data-analysis">Data Analysis</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-500">Under $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                  <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                  <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                  <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                  <SelectItem value="over-10000">Over $10,000</SelectItem>
                  <SelectItem value="discuss">Let's discuss</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Project Timeline</Label>
            <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
              <SelectTrigger>
                <SelectValue placeholder="When do you need this completed?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asap">ASAP</SelectItem>
                <SelectItem value="1-week">Within 1 week</SelectItem>
                <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                <SelectItem value="1-month">Within 1 month</SelectItem>
                <SelectItem value="2-months">Within 2 months</SelectItem>
                <SelectItem value="3-months">Within 3 months</SelectItem>
                <SelectItem value="flexible">I'm flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Project Details *
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Please describe your project requirements, goals, and any specific details you'd like me to know..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              required
              rows={5}
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold mb-2">What happens next?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• I'll review your project details within 24 hours</li>
            <li>• You'll receive a personalized response with next steps</li>
            <li>• We can schedule a call to discuss your project in detail</li>
            <li>• I'll provide a detailed proposal with timeline and pricing</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            Alternative Contact Methods
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open("mailto:deepindersingh042007@gmail.com", "_blank")}
              className="justify-start hover:bg-primary/10"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Direct
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const message = `Hi Deepinder! I'm interested in discussing a project with you.`
                window.open(`https://wa.me/+919876543210?text=${encodeURIComponent(message)}`, "_blank")
              }}
              className="justify-start hover:bg-primary/10"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
