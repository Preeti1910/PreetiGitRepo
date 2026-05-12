using LegalConsultant.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LegalConsultant.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<ConsultationSession> Sessions => Set<ConsultationSession>();
    public DbSet<ConversationMessage> Messages => Set<ConversationMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ConsultationSession>(e =>
        {
            e.HasKey(s => s.Id);
            e.Property(s => s.SerializedAgentSession).HasColumnType("TEXT");
        });

        modelBuilder.Entity<ConversationMessage>(e =>
        {
            e.HasKey(m => m.Id);
            e.HasIndex(m => m.SessionId);
        });
    }
}
