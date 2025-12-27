using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using MotiveBackend.Models;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace MotiveBackend.Data;

public partial class Ecen424DbProjectContext : DbContext
{
    public Ecen424DbProjectContext()
    {
    }

    public Ecen424DbProjectContext(DbContextOptions<Ecen424DbProjectContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<AuditLogDetail> AuditLogDetails { get; set; }

    public virtual DbSet<Authidentity> Authidentities { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Certificate> Certificates { get; set; }

    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<CourseCategory> CourseCategories { get; set; }

    public virtual DbSet<CourseDescription> CourseDescriptions { get; set; }

    public virtual DbSet<CourseInstructor> CourseInstructors { get; set; }

    public virtual DbSet<CourseObjective> CourseObjectives { get; set; }

    public virtual DbSet<CourseRequirement> CourseRequirements { get; set; }

    public virtual DbSet<CourseTargetAudience> CourseTargetAudiences { get; set; }

    public virtual DbSet<Enrollment> Enrollments { get; set; }

    public virtual DbSet<Lesson> Lessons { get; set; }

    public virtual DbSet<LessonProgress> LessonProgresses { get; set; }

    public virtual DbSet<LessonResource> LessonResources { get; set; }

    public virtual DbSet<LoginEvent> LoginEvents { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RolePermission> RolePermissions { get; set; }

    public virtual DbSet<Section> Sections { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserLink> UserLinks { get; set; }

    public virtual DbSet<UserPhone> UserPhones { get; set; }

    public virtual DbSet<UserReview> UserReviews { get; set; }

    public virtual DbSet<ViewMostEnrolled> ViewMostEnrolleds { get; set; }

    public virtual DbSet<ViewMostRecent> ViewMostRecents { get; set; }

    public virtual DbSet<ViewMostTrending> ViewMostTrendings { get; set; }

    public virtual DbSet<ViewTopRated> ViewTopRateds { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=motivedatabase.mysql.database.azure.com;database=ecen424_db_project;userid=YousefTantawy;password=el7amamsyel7amamsy!!;sslmode=Required", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.42-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PRIMARY");

            entity.ToTable("audit_logs");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.LogId).HasColumnName("log_id");
            entity.Property(e => e.ActionType)
                .HasMaxLength(50)
                .HasColumnName("action_type");
            entity.Property(e => e.EntityAffected)
                .HasMaxLength(50)
                .HasColumnName("entity_affected");
            entity.Property(e => e.EntityId)
                .HasMaxLength(50)
                .HasColumnName("entity_id");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(45)
                .HasColumnName("ip_address");
            entity.Property(e => e.Timestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("timestamp");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.AuditLogs)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("audit_logs_ibfk_1");
        });

        modelBuilder.Entity<AuditLogDetail>(entity =>
        {
            entity.HasKey(e => e.DetailId).HasName("PRIMARY");

            entity.ToTable("audit_log_details");

            entity.HasIndex(e => e.LogId, "log_id");

            entity.Property(e => e.DetailId).HasColumnName("detail_id");
            entity.Property(e => e.FieldName)
                .HasMaxLength(50)
                .HasColumnName("field_name");
            entity.Property(e => e.LogId).HasColumnName("log_id");
            entity.Property(e => e.NewValue)
                .HasColumnType("text")
                .HasColumnName("new_value");
            entity.Property(e => e.OldValue)
                .HasColumnType("text")
                .HasColumnName("old_value");

            entity.HasOne(d => d.Log).WithMany(p => p.AuditLogDetails)
                .HasForeignKey(d => d.LogId)
                .HasConstraintName("audit_log_details_ibfk_1");
        });

        modelBuilder.Entity<Authidentity>(entity =>
        {
            entity.HasKey(e => e.AuthId).HasName("PRIMARY");

            entity.ToTable("authidentities");

            entity.HasIndex(e => new { e.Provider, e.ProviderKey }, "provider").IsUnique();

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.AuthId).HasColumnName("auth_id");
            entity.Property(e => e.LastLogin)
                .HasColumnType("datetime")
                .HasColumnName("last_login");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.Provider)
                .HasMaxLength(50)
                .HasColumnName("provider");
            entity.Property(e => e.ProviderKey).HasColumnName("provider_key");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Authidentities)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("authidentities_ibfk_1");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PRIMARY");

            entity.ToTable("categories");

            entity.HasIndex(e => e.ParentId, "parent_id");

            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.IconClass)
                .HasMaxLength(50)
                .HasColumnName("icon_class");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.ParentId).HasColumnName("parent_id");

            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent)
                .HasForeignKey(d => d.ParentId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("categories_ibfk_1");
        });

        modelBuilder.Entity<Certificate>(entity =>
        {
            entity.HasKey(e => e.CertificateId).HasName("PRIMARY");

            entity.ToTable("certificates");

            entity.HasIndex(e => e.EnrollmentId, "enrollment_id").IsUnique();

            entity.HasIndex(e => e.UniqueCode, "unique_code").IsUnique();

            entity.Property(e => e.CertificateId).HasColumnName("certificate_id");
            entity.Property(e => e.EnrollmentId).HasColumnName("enrollment_id");
            entity.Property(e => e.IssueDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("issue_date");
            entity.Property(e => e.PdfUrl)
                .HasMaxLength(255)
                .HasColumnName("pdf_url");
            entity.Property(e => e.UniqueCode)
                .HasMaxLength(50)
                .HasColumnName("unique_code");

            entity.HasOne(d => d.Enrollment).WithOne(p => p.Certificate)
                .HasForeignKey<Certificate>(d => d.EnrollmentId)
                .HasConstraintName("certificates_ibfk_1");
        });

        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => e.CourseId).HasName("PRIMARY");

            entity.ToTable("courses");

            entity.HasIndex(e => e.Slug, "slug").IsUnique();

            entity.Property(e => e.CourseId).HasColumnName("course_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DifficultyLevel)
                .HasMaxLength(20)
                .HasColumnName("difficulty_level");
            entity.Property(e => e.Language)
                .HasMaxLength(50)
                .HasDefaultValueSql("'English'")
                .HasColumnName("language");
            entity.Property(e => e.Price)
                .HasPrecision(10, 2)
                .HasColumnName("price");
            entity.Property(e => e.Slug)
                .HasMaxLength(250)
                .HasColumnName("slug");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Draft'")
                .HasColumnName("status");
            entity.Property(e => e.ThumbnailUrl)
                .HasMaxLength(255)
                .HasColumnName("thumbnail_url");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasColumnName("title");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<CourseCategory>(entity =>
        {
            entity.HasKey(e => e.ClassificationId).HasName("PRIMARY");

            entity.ToTable("course_categories");

            entity.HasIndex(e => e.CategoryId, "category_id");

            entity.HasIndex(e => new { e.CourseId, e.CategoryId }, "course_id").IsUnique();

            entity.Property(e => e.ClassificationId).HasColumnName("classification_id");
            entity.Property(e => e.AssignedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("assigned_at");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.CourseId).HasColumnName("course_id");

            entity.HasOne(d => d.Category).WithMany(p => p.CourseCategories)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("course_categories_ibfk_2");

            entity.HasOne(d => d.Course).WithMany(p => p.CourseCategories)
                .HasForeignKey(d => d.CourseId)
                .HasConstraintName("course_categories_ibfk_1");
        });

        modelBuilder.Entity<CourseDescription>(entity =>
        {
            entity.HasKey(e => e.DescriptionId).HasName("PRIMARY");

            entity.ToTable("course_descriptions");

            entity.HasIndex(e => e.CourseId, "course_id").IsUnique();

            entity.Property(e => e.DescriptionId).HasColumnName("description_id");
            entity.Property(e => e.CourseId).HasColumnName("course_id");
            entity.Property(e => e.FullText)
                .HasColumnType("text")
                .HasColumnName("full_text");

            entity.HasOne(d => d.Course).WithOne(p => p.CourseDescription)
                .HasForeignKey<CourseDescription>(d => d.CourseId)
                .HasConstraintName("course_descriptions_ibfk_1");
        });

        modelBuilder.Entity<CourseInstructor>(entity =>
        {
            entity.HasKey(e => e.AssignmentId).HasName("PRIMARY");

            entity.ToTable("course_instructors");

            entity.HasIndex(e => new { e.CourseId, e.UserId }, "course_id").IsUnique();

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.AssignmentId).HasColumnName("assignment_id");
            entity.Property(e => e.AssignedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("assigned_at");
            entity.Property(e => e.CourseId).HasColumnName("course_id");
            entity.Property(e => e.IsPrimaryAuthor)
                .HasDefaultValueSql("'0'")
                .HasColumnName("is_primary_author");
            entity.Property(e => e.RevenueShare)
                .HasPrecision(5, 2)
                .HasDefaultValueSql("'0.00'")
                .HasColumnName("revenue_share");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Course).WithMany(p => p.CourseInstructors)
                .HasForeignKey(d => d.CourseId)
                .HasConstraintName("course_instructors_ibfk_1");

            entity.HasOne(d => d.User).WithMany(p => p.CourseInstructors)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("course_instructors_ibfk_2");
        });

        modelBuilder.Entity<CourseObjective>(entity =>
        {
            entity.HasKey(e => e.ObjectiveId).HasName("PRIMARY");

            entity.ToTable("course_objectives");

            entity.HasIndex(e => e.DescriptionId, "description_id");

            entity.Property(e => e.ObjectiveId).HasColumnName("objective_id");
            entity.Property(e => e.DescriptionId).HasColumnName("description_id");
            entity.Property(e => e.ObjectiveText)
                .HasMaxLength(255)
                .HasColumnName("objective_text");

            entity.HasOne(d => d.Description).WithMany(p => p.CourseObjectives)
                .HasForeignKey(d => d.DescriptionId)
                .HasConstraintName("course_objectives_ibfk_1");
        });

        modelBuilder.Entity<CourseRequirement>(entity =>
        {
            entity.HasKey(e => e.RequirementId).HasName("PRIMARY");

            entity.ToTable("course_requirements");

            entity.HasIndex(e => e.DescriptionId, "description_id");

            entity.Property(e => e.RequirementId).HasColumnName("requirement_id");
            entity.Property(e => e.DescriptionId).HasColumnName("description_id");
            entity.Property(e => e.RequirementText)
                .HasMaxLength(255)
                .HasColumnName("requirement_text");

            entity.HasOne(d => d.Description).WithMany(p => p.CourseRequirements)
                .HasForeignKey(d => d.DescriptionId)
                .HasConstraintName("course_requirements_ibfk_1");
        });

        modelBuilder.Entity<CourseTargetAudience>(entity =>
        {
            entity.HasKey(e => e.AudienceId).HasName("PRIMARY");

            entity.ToTable("course_target_audiences");

            entity.HasIndex(e => e.DescriptionId, "description_id");

            entity.Property(e => e.AudienceId).HasColumnName("audience_id");
            entity.Property(e => e.AudienceText)
                .HasMaxLength(255)
                .HasColumnName("audience_text");
            entity.Property(e => e.DescriptionId).HasColumnName("description_id");

            entity.HasOne(d => d.Description).WithMany(p => p.CourseTargetAudiences)
                .HasForeignKey(d => d.DescriptionId)
                .HasConstraintName("course_target_audiences_ibfk_1");
        });

        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.HasKey(e => e.EnrollmentId).HasName("PRIMARY");

            entity.ToTable("enrollments");

            entity.HasIndex(e => e.CourseId, "course_id");

            entity.HasIndex(e => new { e.UserId, e.CourseId }, "user_id").IsUnique();

            entity.Property(e => e.EnrollmentId).HasColumnName("enrollment_id");
            entity.Property(e => e.AccessType)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Lifetime'")
                .HasColumnName("access_type");
            entity.Property(e => e.CompletionDate)
                .HasColumnType("datetime")
                .HasColumnName("completion_date");
            entity.Property(e => e.CourseId).HasColumnName("course_id");
            entity.Property(e => e.EnrolledAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("enrolled_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Course).WithMany(p => p.Enrollments)
                .HasForeignKey(d => d.CourseId)
                .HasConstraintName("enrollments_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.Enrollments)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("enrollments_ibfk_1");
        });

        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.HasKey(e => e.LessonId).HasName("PRIMARY");

            entity.ToTable("lessons");

            entity.HasIndex(e => e.SectionId, "section_id");

            entity.Property(e => e.LessonId).HasColumnName("lesson_id");
            entity.Property(e => e.ContentType)
                .HasMaxLength(20)
                .HasColumnName("content_type");
            entity.Property(e => e.DurationSeconds)
                .HasDefaultValueSql("'0'")
                .HasColumnName("duration_seconds");
            entity.Property(e => e.IsPreviewable)
                .HasDefaultValueSql("'0'")
                .HasColumnName("is_previewable");
            entity.Property(e => e.OrderIndex).HasColumnName("order_index");
            entity.Property(e => e.SectionId).HasColumnName("section_id");
            entity.Property(e => e.TextContent)
                .HasColumnType("text")
                .HasColumnName("text_content");
            entity.Property(e => e.Title)
                .HasMaxLength(150)
                .HasColumnName("title");
            entity.Property(e => e.VideoUrl)
                .HasMaxLength(255)
                .HasColumnName("video_url");

            entity.HasOne(d => d.Section).WithMany(p => p.Lessons)
                .HasForeignKey(d => d.SectionId)
                .HasConstraintName("lessons_ibfk_1");
        });

        modelBuilder.Entity<LessonProgress>(entity =>
        {
            entity.HasKey(e => e.ProgressId).HasName("PRIMARY");

            entity.ToTable("lesson_progress");

            entity.HasIndex(e => new { e.EnrollmentId, e.LessonId }, "enrollment_id").IsUnique();

            entity.HasIndex(e => e.LessonId, "lesson_id");

            entity.Property(e => e.ProgressId).HasColumnName("progress_id");
            entity.Property(e => e.EnrollmentId).HasColumnName("enrollment_id");
            entity.Property(e => e.IsCompleted)
                .HasDefaultValueSql("'0'")
                .HasColumnName("is_completed");
            entity.Property(e => e.LastWatchedSecond)
                .HasDefaultValueSql("'0'")
                .HasColumnName("last_watched_second");
            entity.Property(e => e.LessonId).HasColumnName("lesson_id");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.Enrollment).WithMany(p => p.LessonProgresses)
                .HasForeignKey(d => d.EnrollmentId)
                .HasConstraintName("lesson_progress_ibfk_1");

            entity.HasOne(d => d.Lesson).WithMany(p => p.LessonProgresses)
                .HasForeignKey(d => d.LessonId)
                .HasConstraintName("lesson_progress_ibfk_2");
        });

        modelBuilder.Entity<LessonResource>(entity =>
        {
            entity.HasKey(e => e.ResourceId).HasName("PRIMARY");

            entity.ToTable("lesson_resources");

            entity.HasIndex(e => e.LessonId, "lesson_id");

            entity.Property(e => e.ResourceId).HasColumnName("resource_id");
            entity.Property(e => e.LessonId).HasColumnName("lesson_id");
            entity.Property(e => e.ResourceName)
                .HasMaxLength(100)
                .HasColumnName("resource_name");
            entity.Property(e => e.ResourceUrl)
                .HasMaxLength(255)
                .HasColumnName("resource_url");

            entity.HasOne(d => d.Lesson).WithMany(p => p.LessonResources)
                .HasForeignKey(d => d.LessonId)
                .HasConstraintName("lesson_resources_ibfk_1");
        });

        modelBuilder.Entity<LoginEvent>(entity =>
        {
            entity.HasKey(e => e.EventId).HasName("PRIMARY");

            entity.ToTable("login_events");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.EventId).HasColumnName("event_id");
            entity.Property(e => e.AttemptTime)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("attempt_time");
            entity.Property(e => e.FailureReason)
                .HasMaxLength(100)
                .HasColumnName("failure_reason");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(45)
                .HasColumnName("ip_address");
            entity.Property(e => e.IsSuccessful).HasColumnName("is_successful");
            entity.Property(e => e.UserAgent)
                .HasMaxLength(255)
                .HasColumnName("user_agent");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.LoginEvents)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("login_events_ibfk_1");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PRIMARY");

            entity.ToTable("payments");

            entity.HasIndex(e => e.EnrollmentId, "enrollment_id").IsUnique();

            entity.Property(e => e.PaymentId).HasColumnName("payment_id");
            entity.Property(e => e.AmountPaid)
                .HasPrecision(10, 2)
                .HasColumnName("amount_paid");
            entity.Property(e => e.CurrencyCode)
                .HasMaxLength(3)
                .HasDefaultValueSql("'USD'")
                .IsFixedLength()
                .HasColumnName("currency_code");
            entity.Property(e => e.EnrollmentId).HasColumnName("enrollment_id");
            entity.Property(e => e.PaymentDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("payment_date");
            entity.Property(e => e.PaymentMethod)
                .HasMaxLength(50)
                .HasColumnName("payment_method");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Success'")
                .HasColumnName("status");
            entity.Property(e => e.TransactionReference)
                .HasMaxLength(100)
                .HasColumnName("transaction_reference");

            entity.HasOne(d => d.Enrollment).WithOne(p => p.Payment)
                .HasForeignKey<Payment>(d => d.EnrollmentId)
                .HasConstraintName("payments_ibfk_1");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PRIMARY");

            entity.ToTable("roles");

            entity.HasIndex(e => e.Name, "name").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => e.PermissionId).HasName("PRIMARY");

            entity.ToTable("role_permissions");

            entity.HasIndex(e => e.RoleId, "role_id");

            entity.Property(e => e.PermissionId).HasColumnName("permission_id");
            entity.Property(e => e.PermissionSlug)
                .HasMaxLength(100)
                .HasColumnName("permission_slug");
            entity.Property(e => e.RoleId).HasColumnName("role_id");

            entity.HasOne(d => d.Role).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("role_permissions_ibfk_1");
        });

        modelBuilder.Entity<Section>(entity =>
        {
            entity.HasKey(e => e.SectionId).HasName("PRIMARY");

            entity.ToTable("sections");

            entity.HasIndex(e => e.CourseId, "course_id");

            entity.Property(e => e.SectionId).HasColumnName("section_id");
            entity.Property(e => e.CourseId).HasColumnName("course_id");
            entity.Property(e => e.Objective)
                .HasColumnType("text")
                .HasColumnName("objective");
            entity.Property(e => e.OrderIndex).HasColumnName("order_index");
            entity.Property(e => e.Title)
                .HasMaxLength(150)
                .HasColumnName("title");

            entity.HasOne(d => d.Course).WithMany(p => p.Sections)
                .HasForeignKey(d => d.CourseId)
                .HasConstraintName("sections_ibfk_1");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.HasIndex(e => e.RoleId, "role_id");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Biography)
                .HasColumnType("text")
                .HasColumnName("biography");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .HasColumnName("first_name");
            entity.Property(e => e.Headline)
                .HasMaxLength(100)
                .HasColumnName("headline");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .HasColumnName("last_name");
            entity.Property(e => e.ProfilePictureUrl)
                .HasMaxLength(255)
                .HasColumnName("profile_picture_url");
            entity.Property(e => e.RoleId).HasColumnName("role_id");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("users_ibfk_1");
        });

        modelBuilder.Entity<UserLink>(entity =>
        {
            entity.HasKey(e => e.LinkId).HasName("PRIMARY");

            entity.ToTable("user_links");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.LinkId).HasColumnName("link_id");
            entity.Property(e => e.PlatformName)
                .HasMaxLength(50)
                .HasColumnName("platform_name");
            entity.Property(e => e.Url)
                .HasMaxLength(255)
                .HasColumnName("url");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.UserLinks)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("user_links_ibfk_1");
        });

        modelBuilder.Entity<UserPhone>(entity =>
        {
            entity.HasKey(e => e.PhoneId).HasName("PRIMARY");

            entity.ToTable("user_phones");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.PhoneId).HasColumnName("phone_id");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(20)
                .HasColumnName("phone_number");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.UserPhones)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("user_phones_ibfk_1");
        });

        modelBuilder.Entity<UserReview>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PRIMARY");

            entity.ToTable("user_reviews");

            entity.HasIndex(e => e.CourseId, "course_id");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.ReviewId).HasColumnName("review_id");
            entity.Property(e => e.Comment)
                .HasColumnType("text")
                .HasColumnName("comment");
            entity.Property(e => e.CourseId).HasColumnName("course_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.RatingValue).HasColumnName("rating_value");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Course).WithMany(p => p.UserReviews)
                .HasForeignKey(d => d.CourseId)
                .HasConstraintName("user_reviews_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.UserReviews)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("user_reviews_ibfk_1");
        });

        modelBuilder.Entity<ViewMostEnrolled>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("view_most_enrolled");

            entity.Property(e => e.AvgRating)
                .HasPrecision(7, 4)
                .HasColumnName("avg_rating");
            entity.Property(e => e.CourseId).HasColumnName("course_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Price)
                .HasPrecision(10, 2)
                .HasColumnName("price");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasColumnName("title");
        });

        modelBuilder.Entity<ViewMostRecent>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("view_most_recent");

            entity.Property(e => e.AvgRating)
                .HasPrecision(7, 4)
                .HasColumnName("avg_rating");
            entity.Property(e => e.CourseId).HasColumnName("course_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Price)
                .HasPrecision(10, 2)
                .HasColumnName("price");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasColumnName("title");
        });

        modelBuilder.Entity<ViewMostTrending>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("view_most_trending");

            entity.Property(e => e.AvgRating)
                .HasPrecision(7, 4)
                .HasColumnName("avg_rating");
            entity.Property(e => e.CourseId).HasColumnName("course_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Price)
                .HasPrecision(10, 2)
                .HasColumnName("price");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasColumnName("title");
        });

        modelBuilder.Entity<ViewTopRated>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("view_top_rated");

            entity.Property(e => e.AvgRating)
                .HasPrecision(7, 4)
                .HasColumnName("avg_rating");
            entity.Property(e => e.CourseId).HasColumnName("course_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Price)
                .HasPrecision(10, 2)
                .HasColumnName("price");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasColumnName("title");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
