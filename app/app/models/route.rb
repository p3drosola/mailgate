class Route < ActiveRecord::Base

  attr_accessor  :user_id, :email, :name, :forward_count
  attr_accessible :enabled

  before_validation :generate_email
  validates_uniqueness_of :forwarder

  belongs_to :user

  protected

  def generate_email
    return if self.email

    adjectives = 'flying running big red blue black green purple shiny light falling active little tasty dusty'.split
    nouns = 'rock boat bear monster bug rabbit hamster haze mouse button rocket bottle graph token code garden'.split
    self.email = loop do
      n = "#{adjectives.sample}-#{nouns.sample}-#{SecureRandom.random_number(1000000)+1}"
      break n unless Route.where(:email => n).exists?
    end
  end

end