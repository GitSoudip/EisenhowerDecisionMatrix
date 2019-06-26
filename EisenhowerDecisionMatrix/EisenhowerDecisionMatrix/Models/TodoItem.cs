namespace TodoApi.Models
{
	public class TodoItem
	{
		public enum Position
		{
			UrgentAndImportant,
			NotUrgentAndImportant,
			UrgentButNotImportant,
			NotUrgentNotImportant
		}
		public long Id { get; set; }
		public string Title { get; set; }

		public string Description { get; set; }
		public bool IsUrgent { get; set; }
		public bool IsImportant { get; set; }
		public bool IsComplete { get; set; }
		public Position Placement
		{
			get
			{
				if (IsUrgent && IsImportant) return Position.UrgentAndImportant;
				else if (!IsUrgent && IsImportant) return Position.NotUrgentAndImportant;
				else if (IsUrgent && !IsImportant) return Position.UrgentButNotImportant;
				else return Position.NotUrgentNotImportant;
			}
		}
	}
}


